import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, RefreshCw, Search, Trash2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommentRow {
  id: string;
  comment: string;
  user_name: string | null;
  product_id: string;
  created_at: string;
  product_name?: string;
}

export function CommentsList() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data: commentsData, error } = await supabase
        .from("product_comments")
        .select("id, comment, user_name, product_id, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const list = (commentsData || []) as CommentRow[];

      // Resolve product names (no FK required)
      const productIds = [...new Set(list.map((c) => c.product_id).filter(Boolean))];
      let nameById: Record<string, string> = {};

      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name")
          .in("id", productIds);

        nameById = Object.fromEntries(
          (productsData || []).map((p) => [p.id, p.name])
        );
      }

      setComments(
        list.map((c) => ({
          ...c,
          products: c.product_id
            ? { name: nameById[c.product_id] || "Unknown product", slug: c.product_id }
            : null,
        }))
      );
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Could not load comments",
        description: err?.message || "Check product_comments table / RLS.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter(
      (c) =>
        c.comment?.toLowerCase().includes(q) ||
        c.user_name?.toLowerCase().includes(q) ||
        c.products?.name?.toLowerCase().includes(q) ||
        c.product_id?.toLowerCase().includes(q)
    );
  }, [comments, search]);

  const deleteComment = async (id: string) => {
    if (!confirm("Delete this comment permanently from the database?")) return;
    setDeletingId(id);
    try {
      const { error, count } = await supabase
        .from("product_comments")
        .delete({ count: "exact" })
        .eq("id", id);

      if (error) throw error;
      if (count === 0) {
        throw new Error(
          "Comment not deleted (0 rows). Run supabase/comments_delete_policy.sql in Supabase."
        );
      }

      setComments((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Comment deleted",
        description: "Removed from the database.",
      });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description:
          err?.message?.includes("policy") || err?.message?.includes("0 rows")
            ? "Permission blocked. Run supabase/comments_delete_policy.sql in Supabase SQL Editor."
            : err?.message || "Could not delete comment.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Customer Comments
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Reviews left on product pages. Delete inappropriate ones.
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={fetchComments}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search comment, name, product…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 rounded-full"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments…</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {comments.length === 0 ? "No comments yet." : "No comments match your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} className="border-black/[0.04]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{c.user_name || "Anonymous"}</span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                      {c.products?.name && (
                        <Badge variant="secondary" className="text-[10px]">
                          {c.products.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                      {c.comment}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {c.product_id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 text-xs"
                          asChild
                        >
                          <Link to={`/products/${c.product_id}`}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View product
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full h-8 w-8 p-0 text-destructive shrink-0"
                    disabled={deletingId === c.id}
                    onClick={() => deleteComment(c.id)}
                    title="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Showing {filtered.length} of {comments.length} comments
      </p>
    </div>
  );
}
