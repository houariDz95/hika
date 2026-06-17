module.exports = [
"[project]/src/actions/posts.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4017b357a207325af6759c9b46986c3631d9695416":{"name":"incrementViews"},"406805c80ec29cc3f02ab4033b2ec3e3b0662b053d":{"name":"likePost"},"40f2fd67489647456dd25cf5d727b63f429bbe7518":{"name":"deletePost"},"6024781a9f3fc09b220a8371ab66f09df58d5ec27f":{"name":"updatePost"},"6066345e135c161c767fd54ad3a80a325e7e55eca5":{"name":"createPost"}},"src/actions/posts.ts",""] */ __turbopack_context__.s([
    "createPost",
    ()=>createPost,
    "deletePost",
    ()=>deletePost,
    "incrementViews",
    ()=>incrementViews,
    "likePost",
    ()=>likePost,
    "updatePost",
    ()=>updatePost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function requireAdmin() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    return {
        supabase,
        user: data.user
    };
}
async function uploadCoverImage(supabase, file) {
    if (!file || file.size === 0) return null;
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `covers/${fileName}`;
    const { error } = await supabase.storage.from("hikaya").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
    });
    if (error) {
        throw new Error("فشل رفع الصورة: " + error.message);
    }
    const { data } = supabase.storage.from("hikaya").getPublicUrl(filePath);
    return data.publicUrl;
}
async function createPost(_prevState, formData) {
    const { supabase, user } = await requireAdmin();
    const raw = {
        title: formData.get("title"),
        content: formData.get("content"),
        category: formData.get("category") || "",
        status: formData.get("status") || "draft"
    };
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postSchema"].safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.issues[0].message
        };
    }
    let imageUrl = null;
    const imageFile = formData.get("image");
    try {
        if (imageFile) {
            imageUrl = await uploadCoverImage(supabase, imageFile);
        }
    } catch (e) {
        return {
            success: false,
            error: e instanceof Error ? e.message : "خطأ غير معروف"
        };
    }
    const { error } = await supabase.from("posts").insert({
        title: parsed.data.title,
        content: parsed.data.content,
        category: parsed.data.category || null,
        status: parsed.data.status,
        image_url: imageUrl,
        user_id: user.id
    });
    if (error) {
        return {
            success: false,
            error: "فشل إنشاء المقال: " + error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/stories");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
}
async function updatePost(_prevState, formData) {
    const { supabase } = await requireAdmin();
    const id = formData.get("id");
    if (!id) return {
        success: false,
        error: "معرف المقال مفقود"
    };
    const raw = {
        title: formData.get("title"),
        content: formData.get("content"),
        category: formData.get("category") || "",
        status: formData.get("status") || "draft"
    };
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postSchema"].safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.issues[0].message
        };
    }
    const updateData = {
        title: parsed.data.title,
        content: parsed.data.content,
        category: parsed.data.category || null,
        status: parsed.data.status
    };
    const imageFile = formData.get("image");
    try {
        if (imageFile && imageFile.size > 0) {
            updateData.image_url = await uploadCoverImage(supabase, imageFile);
        }
    } catch (e) {
        return {
            success: false,
            error: e instanceof Error ? e.message : "خطأ غير معروف"
        };
    }
    const { error } = await supabase.from("posts").update(updateData).eq("id", id);
    if (error) {
        return {
            success: false,
            error: "فشل تحديث المقال: " + error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/stories");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/story/${id}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
}
async function deletePost(id) {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
        return {
            success: false,
            error: "فشل حذف المقال: " + error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/stories");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    return {
        success: true
    };
}
async function incrementViews(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    await supabase.rpc("increment_post_views", {
        post_id: id
    });
}
async function likePost(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    await supabase.rpc("increment_post_likes", {
        post_id: id
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/story/${id}`);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createPost,
    updatePost,
    deletePost,
    incrementViews,
    likePost
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createPost, "6066345e135c161c767fd54ad3a80a325e7e55eca5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updatePost, "6024781a9f3fc09b220a8371ab66f09df58d5ec27f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePost, "40f2fd67489647456dd25cf5d727b63f429bbe7518", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(incrementViews, "4017b357a207325af6759c9b46986c3631d9695416", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(likePost, "406805c80ec29cc3f02ab4033b2ec3e3b0662b053d", null);
}),
"[project]/.next-internal/server/app/story/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/posts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/posts.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/story/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/posts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "001cb6b06f49d2a425b9638284eca1c0debcfa5fdd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "4017b357a207325af6759c9b46986c3631d9695416",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementViews"],
    "406805c80ec29cc3f02ab4033b2ec3e3b0662b053d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["likePost"],
    "40f2fd67489647456dd25cf5d727b63f429bbe7518",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePost"],
    "601ce9ff703127c461eb2785d4aacbcf08a049fa5f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signup"],
    "6024781a9f3fc09b220a8371ab66f09df58d5ec27f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updatePost"],
    "6066345e135c161c767fd54ad3a80a325e7e55eca5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPost"],
    "60cce53d2680028396785dd487fd6d8dac630923dd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["login"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$story$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/story/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/posts.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/posts.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_1h3wy3b._.js.map