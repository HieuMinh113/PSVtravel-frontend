(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_3e0831._.js", {

"[project]/components/OrbitGallery.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>OrbitGallery
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
function OrbitGallery({ images, radiusLg = 210, radiusMd = 160, radiusSm = 108, cardSizeLg = 92, cardSizeMd = 76, cardSizeSm = 56, duration = 50, showCenter = true, showRing = true }) {
    _s();
    const [{ radius, cardSize }, setDims] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        radius: radiusLg,
        cardSize: cardSizeLg
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleResize = ()=>{
            const w = window.innerWidth;
            if (w < 480) setDims({
                radius: radiusSm,
                cardSize: cardSizeSm
            });
            else if (w < 768) setDims({
                radius: radiusMd,
                cardSize: cardSizeMd
            });
            else setDims({
                radius: radiusLg,
                cardSize: cardSizeLg
            });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, [
        radiusLg,
        radiusMd,
        radiusSm,
        cardSizeLg,
        cardSizeMd,
        cardSizeSm
    ]);
    const angleStep = 360 / images.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative mx-auto",
        style: {
            width: radius * 2 + cardSize,
            height: radius * 2 + cardSize,
            maxWidth: "100%"
        },
        children: [
            showRing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/25",
                style: {
                    width: radius * 2,
                    height: radius * 2
                }
            }, void 0, false, {
                fileName: "[project]/components/OrbitGallery.jsx",
                lineNumber: 46,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute inset-0",
                animate: {
                    rotate: 360
                },
                transition: {
                    repeat: Infinity,
                    duration,
                    ease: "linear"
                },
                children: images.map((src, i)=>{
                    const angle = angleStep * i;
                    const rad = angle * Math.PI / 180;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        // Mỗi ảnh tự xoay ngược lại đúng bằng tốc độ vòng ngoài để luôn thẳng đứng,
                        // không bị lộn ngược khi cả vòng quay quanh tâm.
                        animate: {
                            rotate: -360
                        },
                        transition: {
                            repeat: Infinity,
                            duration,
                            ease: "linear"
                        },
                        className: "absolute overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/80",
                        style: {
                            width: cardSize,
                            height: cardSize,
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: src,
                            alt: "",
                            draggable: false,
                            fill: true,
                            sizes: "200px",
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/OrbitGallery.jsx",
                            lineNumber: 78,
                            columnNumber: 15
                        }, this)
                    }, i, false, {
                        fileName: "[project]/components/OrbitGallery.jsx",
                        lineNumber: 63,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/OrbitGallery.jsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            showCenter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-xl sm:h-24 sm:w-24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-center font-display text-xs font-bold leading-tight text-ocean-700 sm:text-sm",
                    children: [
                        "320+",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/components/OrbitGallery.jsx",
                            lineNumber: 95,
                            columnNumber: 17
                        }, this),
                        "tuyến tour"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OrbitGallery.jsx",
                    lineNumber: 94,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OrbitGallery.jsx",
                lineNumber: 93,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OrbitGallery.jsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(OrbitGallery, "+rIouR0I8U8SxpFz2vh/dXs7pwE=");
_c = OrbitGallery;
var _c;
__turbopack_refresh__.register(_c, "OrbitGallery");

})()),
"[project]/components/PageHero.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>PageHero
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitGallery$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/OrbitGallery.jsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
function PageHero({ eyebrow, title, description, crumbs = [], orbitImages }) {
    const hasOrbit = orbitImages && orbitImages.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `relative overflow-hidden bg-deep-gradient px-5 sm:px-8 ${hasOrbit ? "flex min-h-[100dvh] flex-col items-center justify-center py-28" : "pb-20 pt-32 sm:pt-40"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-aurora-deep bg-[length:190%_190%] animate-aurora opacity-80"
            }, void 0, false, {
                fileName: "[project]/components/PageHero.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-duotone-glow opacity-70"
            }, void 0, false, {
                fileName: "[project]/components/PageHero.jsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-[0.12]",
                style: {
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "30px 30px"
                }
            }, void 0, false, {
                fileName: "[project]/components/PageHero.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            hasOrbit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute inset-0 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OrbitGallery$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            images: orbitImages,
                            radiusLg: 430,
                            radiusMd: 320,
                            radiusSm: 175,
                            cardSizeLg: 104,
                            cardSizeMd: 82,
                            cardSizeSm: 52,
                            showCenter: false
                        }, void 0, false, {
                            fileName: "[project]/components/PageHero.jsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute inset-0",
                        style: {
                            background: "radial-gradient(ellipse 620px 480px at center, rgba(4,15,31,0.8) 0%, rgba(4,15,31,0.55) 45%, rgba(4,15,31,0.15) 68%, transparent 80%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            scale: [
                                1,
                                1.1,
                                1
                            ]
                        },
                        transition: {
                            duration: 9,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        className: "pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-ocean-400/35 blur-[110px]"
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            scale: [
                                1,
                                1.12,
                                1
                            ]
                        },
                        transition: {
                            duration: 11,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.8
                        },
                        className: "pointer-events-none absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-teal-400/15 blur-[90px]"
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            scale: [
                                1,
                                1.15,
                                1
                            ]
                        },
                        transition: {
                            duration: 13,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.6
                        },
                        className: "pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-sunset-500/12 blur-[100px]"
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative z-10 mx-auto text-center ${hasOrbit ? "max-w-3xl" : "max-w-5xl"}`,
                children: [
                    crumbs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "transition-colors hover:text-gold-300",
                                children: "Trang chủ"
                            }, void 0, false, {
                                fileName: "[project]/components/PageHero.jsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            crumbs.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-3 w-3 text-white/50"
                                        }, void 0, false, {
                                            fileName: "[project]/components/PageHero.jsx",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this),
                                        c.to ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: c.to,
                                            className: "transition-colors hover:text-gold-300",
                                            children: c.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/PageHero.jsx",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-white",
                                            children: c.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/PageHero.jsx",
                                            lineNumber: 90,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/components/PageHero.jsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    eyebrow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                        initial: {
                            opacity: 0,
                            y: -10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.5
                        },
                        className: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 backdrop-blur",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-1.5 w-1.5 rounded-full bg-gold-400"
                            }, void 0, false, {
                                fileName: "[project]/components/PageHero.jsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            eyebrow
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                        initial: {
                            opacity: 0,
                            y: 16
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.6,
                            delay: 0.1,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1
                            ]
                        },
                        className: `mt-4 font-display font-bold leading-[1.12] text-white ${hasOrbit ? "text-4xl sm:text-6xl" : "text-4xl sm:text-5xl"}`,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                        initial: {
                            opacity: 0,
                            scaleX: 0
                        },
                        animate: {
                            opacity: 1,
                            scaleX: 1
                        },
                        transition: {
                            duration: 0.7,
                            delay: 0.35,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1
                            ]
                        },
                        className: "mx-auto mt-5 block h-1 w-20 origin-center rounded-full bg-gradient-to-r from-gold-400 via-sunset-500 to-teal-400"
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                        initial: {
                            opacity: 0,
                            y: 16
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.6,
                            delay: 0.2
                        },
                        className: "mx-auto mt-5 max-w-2xl text-white/85",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/PageHero.jsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PageHero.jsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-foam"
            }, void 0, false, {
                fileName: "[project]/components/PageHero.jsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PageHero.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = PageHero;
var _c;
__turbopack_refresh__.register(_c, "PageHero");

})()),
"[project]/data/tours.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Dữ liệu mẫu — trong dự án thật sẽ được thay bằng API/CMS
__turbopack_esm__({
    "abroadTours": ()=>abroadTours,
    "allTours": ()=>allTours,
    "domesticTours": ()=>domesticTours,
    "formatVND": ()=>formatVND,
    "regionIcons": ()=>regionIcons
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/tree-palm.js [app-client] (ecmascript) <export default as Palmtree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mountain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mountain$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/mountain.js [app-client] (ecmascript) <export default as Mountain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/waves.js [app-client] (ecmascript) <export default as Waves>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/landmark.js [app-client] (ecmascript) <export default as Landmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/tree-pine.js [app-client] (ecmascript) <export default as TreePine>");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const domesticTours = [
    {
        slug: "phu-quoc-3n2d",
        name: "Phú Quốc thiên đường biển đảo",
        region: "Miền Nam",
        days: "3 ngày 2 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 5890000,
        oldPrice: 6990000,
        rating: 4.8,
        reviews: 214,
        seatsLeft: 6,
        startDate: "26/07/2026",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Grand World về đêm",
            "Cáp treo Hòn Thơm",
            "VinWonders Safari",
            "Lặn ngắm san hô"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Phú Quốc – Grand World",
                desc: "Đón chuyến bay ra đảo Ngọc, nhận phòng khách sạn, dạo chơi phố đi bộ Grand World với show nhạc nước, ánh sáng rực rỡ."
            },
            {
                day: "Ngày 2",
                title: "VinWonders – Safari – Cáp treo Hòn Thơm",
                desc: "Khám phá công viên giải trí, vườn thú bán hoang dã Safari, trải nghiệm cáp treo vượt biển dài nhất thế giới."
            },
            {
                day: "Ngày 3",
                title: "Chợ đêm Dinh Cậu – Tiễn sân bay",
                desc: "Tự do mua sắm đặc sản, tiễn đoàn ra sân bay về lại TP.HCM."
            }
        ]
    },
    {
        slug: "sapa-fansipan-4n3d",
        name: "Sa Pa – Chinh phục Fansipan",
        region: "Miền Bắc",
        days: "4 ngày 3 đêm",
        departure: "Từ Hà Nội",
        price: 4590000,
        oldPrice: null,
        rating: 4.9,
        reviews: 189,
        seatsLeft: 10,
        startDate: "22/07/2026",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop",
        tag: "Mới",
        highlights: [
            "Đỉnh Fansipan bằng cáp treo",
            "Bản Cát Cát",
            "Ruộng bậc thang Mường Hoa",
            "Chợ phiên vùng cao"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "Hà Nội – Lào Cai – Sa Pa",
                desc: "Khởi hành đêm, di chuyển bằng xe giường nằm cao cấp."
            },
            {
                day: "Ngày 2",
                title: "Bản Cát Cát – Thung lũng Mường Hoa",
                desc: "Tham quan bản làng người H'Mông, ngắm ruộng bậc thang mùa lúa."
            },
            {
                day: "Ngày 3",
                title: "Chinh phục Fansipan",
                desc: "Trải nghiệm cáp treo ba dây hiện đại lên nóc nhà Đông Dương."
            },
            {
                day: "Ngày 4",
                title: "Chợ Sa Pa – Về Hà Nội",
                desc: "Mua sắm quà lưu niệm, khởi hành về Hà Nội."
            }
        ]
    },
    {
        slug: "ha-long-ninh-binh-3n2d",
        name: "Vịnh Hạ Long – Tràng An Ninh Bình",
        region: "Miền Bắc",
        days: "3 ngày 2 đêm",
        departure: "Từ Hà Nội",
        price: 4290000,
        oldPrice: 4890000,
        rating: 4.7,
        reviews: 302,
        seatsLeft: 8,
        startDate: "19/07/2026",
        image: "https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?q=80&w=1600&auto=format&fit=crop",
        tag: "Giảm giá",
        highlights: [
            "Du thuyền ngủ đêm trên vịnh",
            "Hang Sửng Sốt",
            "Thuyền Tràng An",
            "Chùa Bái Đính"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "Hà Nội – Hạ Long",
                desc: "Lên du thuyền 4 sao, thưởng thức hải sản, ngắm hoàng hôn trên vịnh."
            },
            {
                day: "Ngày 2",
                title: "Hang Sửng Sốt – Ninh Bình",
                desc: "Chèo kayak, khám phá hang động, di chuyển về Tràng An."
            },
            {
                day: "Ngày 3",
                title: "Tràng An – Bái Đính – Hà Nội",
                desc: "Ngồi thuyền xuyên hang Tràng An, viếng chùa Bái Đính."
            }
        ]
    },
    {
        slug: "da-nang-hoi-an-hue-5n4d",
        name: "Đà Nẵng – Hội An – Huế mộng mơ",
        region: "Miền Trung",
        days: "5 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 8799000,
        oldPrice: 9599000,
        rating: 4.8,
        reviews: 256,
        seatsLeft: 10,
        startDate: "22/07/2026",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Bà Nà Hills – Cầu Vàng",
            "Phố cổ Hội An về đêm",
            "Đại Nội Huế",
            "Động Phong Nha"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Đà Nẵng",
                desc: "Nhận phòng, dạo biển Mỹ Khê."
            },
            {
                day: "Ngày 2",
                title: "Bà Nà Hills",
                desc: "Tham quan Cầu Vàng, Làng Pháp, vườn hoa Le Jardin."
            },
            {
                day: "Ngày 3",
                title: "Hội An – Đèn lồng cổ trấn",
                desc: "Phố cổ Hội An, thả đèn hoa đăng trên sông Hoài."
            },
            {
                day: "Ngày 4",
                title: "Huế – Đại Nội",
                desc: "Tham quan Đại Nội, lăng tẩm triều Nguyễn."
            },
            {
                day: "Ngày 5",
                title: "Động Phong Nha – Tiễn sân bay",
                desc: "Khám phá hang động, ra sân bay về lại."
            }
        ]
    },
    {
        slug: "mien-tay-can-tho-3n2d",
        name: "Miền Tây sông nước Cần Thơ",
        region: "Miền Nam",
        days: "3 ngày 2 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 2990000,
        oldPrice: null,
        rating: 4.6,
        reviews: 143,
        seatsLeft: 10,
        startDate: "24/07/2026",
        image: "https://images.unsplash.com/photo-1596395463024-e37ff86e1e0e?q=80&w=1600&auto=format&fit=crop",
        tag: null,
        highlights: [
            "Chợ nổi Cái Răng",
            "Vườn trái cây miệt vườn",
            "Cù Lao Thới Sơn",
            "Đờn ca tài tử"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Mỹ Tho – Bến Tre",
                desc: "Tham quan cù lao, thưởng thức trà mật ong, đờn ca tài tử."
            },
            {
                day: "Ngày 2",
                title: "Cần Thơ – Chợ nổi Cái Răng",
                desc: "Dậy sớm khám phá chợ nổi, tham quan vườn trái cây."
            },
            {
                day: "Ngày 3",
                title: "Sóc Trăng – Về TP.HCM",
                desc: "Viếng chùa Dơi, mua đặc sản, khởi hành về."
            }
        ]
    },
    {
        slug: "ha-giang-4n3d",
        name: "Hà Giang mùa hoa tam giác mạch",
        region: "Miền Bắc",
        days: "4 ngày 3 đêm",
        departure: "Từ Hà Nội",
        price: 5290000,
        oldPrice: null,
        rating: 4.9,
        reviews: 97,
        seatsLeft: 5,
        startDate: "15/08/2026",
        image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1600&auto=format&fit=crop",
        tag: "Mới",
        highlights: [
            "Đèo Mã Pí Lèng",
            "Sông Nho Quế",
            "Cao nguyên đá Đồng Văn",
            "Cột cờ Lũng Cú"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "Hà Nội – Hà Giang",
                desc: "Khởi hành sớm, nghỉ chân tại Tam Sơn."
            },
            {
                day: "Ngày 2",
                title: "Đồng Văn – Lũng Cú",
                desc: "Chinh phục cột cờ Lũng Cú, tham quan phố cổ Đồng Văn."
            },
            {
                day: "Ngày 3",
                title: "Mã Pí Lèng – Sông Nho Quế",
                desc: "Đi thuyền trên sông Nho Quế, ngắm đèo Mã Pí Lèng hùng vĩ."
            },
            {
                day: "Ngày 4",
                title: "Về Hà Nội",
                desc: "Trên đường về ghé chợ phiên vùng cao."
            }
        ]
    }
];
const abroadTours = [
    {
        slug: "thai-lan-bangkok-pattaya-5n4d",
        name: "Thái Lan Bangkok – Pattaya",
        region: "Đông Nam Á",
        country: "Thái Lan",
        days: "5 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 7990000,
        oldPrice: 8990000,
        rating: 4.7,
        reviews: 421,
        seatsLeft: 10,
        startDate: "02/08/2026",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Đảo Coral đảo San Hô",
            "Chợ nổi Damnoen Saduak",
            "Chùa Vàng, Chùa Bình Minh",
            "Show Alcazar"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Bangkok",
                desc: "Bay sang Bangkok, tham quan thành phố về đêm."
            },
            {
                day: "Ngày 2",
                title: "Chợ nổi – Pattaya",
                desc: "Tham quan chợ nổi, di chuyển đến Pattaya."
            },
            {
                day: "Ngày 3",
                title: "Đảo San Hô",
                desc: "Vui chơi thể thao biển tại Coral Island."
            },
            {
                day: "Ngày 4",
                title: "Show Alcazar – Bangkok",
                desc: "Xem show nghệ thuật nổi tiếng, mua sắm tại Bangkok."
            },
            {
                day: "Ngày 5",
                title: "Chùa Vàng – Về nước",
                desc: "Tham quan chùa, ra sân bay về TP.HCM."
            }
        ]
    },
    {
        slug: "han-quoc-seoul-nami-4n3d",
        name: "Hàn Quốc Seoul – Đảo Nami",
        region: "Đông Bắc Á",
        country: "Hàn Quốc",
        days: "4 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 17499000,
        oldPrice: 18990000,
        rating: 4.8,
        reviews: 268,
        seatsLeft: 6,
        startDate: "26/07/2026",
        image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Đảo Nami lãng mạn",
            "Tháp Namsan",
            "Cung điện Gyeongbokgung",
            "Everland Park"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Seoul",
                desc: "Đáp chuyến bay đêm đến Incheon."
            },
            {
                day: "Ngày 2",
                title: "Đảo Nami – Petite France",
                desc: "Tham quan bối cảnh phim Bản tình ca mùa đông."
            },
            {
                day: "Ngày 3",
                title: "Everland – Chợ Myeongdong",
                desc: "Vui chơi công viên giải trí lớn nhất Hàn Quốc."
            },
            {
                day: "Ngày 4",
                title: "Cung điện – Về nước",
                desc: "Tham quan cung điện cổ, mua sắm mỹ phẩm."
            }
        ]
    },
    {
        slug: "nhat-ban-osaka-kyoto-5n5d",
        name: "Nhật Bản Osaka – Kyoto – Núi Phú Sĩ",
        region: "Đông Bắc Á",
        country: "Nhật Bản",
        days: "5 ngày 5 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 34999000,
        oldPrice: null,
        rating: 4.9,
        reviews: 156,
        seatsLeft: 9,
        startDate: "23/07/2026",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop",
        tag: "Cao cấp",
        highlights: [
            "Núi Phú Sĩ",
            "Đền Fushimi Inari",
            "Lâu đài Osaka",
            "Phố cổ Kyoto"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Osaka",
                desc: "Nhận phòng khách sạn trung tâm Osaka."
            },
            {
                day: "Ngày 2",
                title: "Kyoto cổ kính",
                desc: "Tham quan đền Fushimi Inari, rừng tre Arashiyama."
            },
            {
                day: "Ngày 3",
                title: "Núi Phú Sĩ",
                desc: "Ngắm núi thiêng từ hồ Kawaguchi."
            },
            {
                day: "Ngày 4",
                title: "Tokyo – Yamanashi",
                desc: "Tự do khám phá theo lịch trình gợi ý."
            },
            {
                day: "Ngày 5",
                title: "Về nước",
                desc: "Mua sắm quà lưu niệm, ra sân bay."
            }
        ]
    },
    {
        slug: "singapore-sentosa-4n3d",
        name: "Singapore – Đảo Sentosa",
        region: "Đông Nam Á",
        country: "Singapore",
        days: "4 ngày 3 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 12990000,
        oldPrice: 13990000,
        rating: 4.7,
        reviews: 198,
        seatsLeft: 10,
        startDate: "30/07/2026",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop",
        tag: "Giảm giá",
        highlights: [
            "Gardens by the Bay",
            "Universal Studios Sentosa",
            "Vịnh Marina",
            "Chinatown"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Singapore",
                desc: "Tham quan vịnh Marina Bay về đêm."
            },
            {
                day: "Ngày 2",
                title: "Sentosa – Universal Studios",
                desc: "Vui chơi cả ngày tại đảo giải trí Sentosa."
            },
            {
                day: "Ngày 3",
                title: "Gardens by the Bay",
                desc: "Ngắm Supertree Grove, mua sắm Orchard Road."
            },
            {
                day: "Ngày 4",
                title: "Về nước",
                desc: "Tự do buổi sáng, ra sân bay."
            }
        ]
    },
    {
        slug: "trung-quoc-truong-gia-gioi-6n5d",
        name: "Trung Quốc Ân Thi – Trương Gia Giới",
        region: "Đông Bắc Á",
        country: "Trung Quốc",
        days: "6 ngày 5 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 17990000,
        oldPrice: null,
        rating: 4.6,
        reviews: 88,
        seatsLeft: 5,
        startDate: "19/07/2026",
        image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=1600&auto=format&fit=crop",
        tag: null,
        highlights: [
            "Núi Thiên Môn Sơn",
            "Cầu kính Trương Gia Giới",
            "Phượng Hoàng Cổ Trấn",
            "Rừng cột đá Avatar"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Trương Gia Giới",
                desc: "Nhận phòng, nghỉ ngơi sau chuyến bay."
            },
            {
                day: "Ngày 2",
                title: "Thiên Môn Sơn",
                desc: "Cáp treo dài nhất thế giới, cổng trời huyền thoại."
            },
            {
                day: "Ngày 3",
                title: "Cầu kính đại phong cảnh",
                desc: "Trải nghiệm cầu kính cao nhất thế giới."
            },
            {
                day: "Ngày 4",
                title: "Phượng Hoàng Cổ Trấn",
                desc: "Dạo phố cổ bên sông Đà Giang."
            },
            {
                day: "Ngày 5",
                title: "Ân Thi",
                desc: "Tham quan thị trấn cổ trầm mặc."
            },
            {
                day: "Ngày 6",
                title: "Về nước",
                desc: "Ra sân bay về TP.HCM."
            }
        ]
    },
    {
        slug: "dai-loan-dai-bac-cao-hung-5n4d",
        name: "Đài Loan Đài Bắc – Cao Hùng",
        region: "Đông Bắc Á",
        country: "Đài Loan",
        days: "5 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 12999000,
        oldPrice: 13990000,
        rating: 4.7,
        reviews: 132,
        seatsLeft: 7,
        startDate: "01/08/2026",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=1600&auto=format&fit=crop",
        tag: "Giảm giá",
        highlights: [
            "Tháp Đài Bắc 101",
            "Cửu Phần cổ trấn",
            "Hồ Nhật Nguyệt",
            "Chợ đêm Sĩ Lâm"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Đài Bắc",
                desc: "Tham quan tháp Đài Bắc 101, chợ đêm Sĩ Lâm."
            },
            {
                day: "Ngày 2",
                title: "Cửu Phần – Thập Phần",
                desc: "Thả đèn trời tại phố cổ Thập Phần."
            },
            {
                day: "Ngày 3",
                title: "Hồ Nhật Nguyệt",
                desc: "Du thuyền ngắm hồ nước ngọt đẹp nhất Đài Loan."
            },
            {
                day: "Ngày 4",
                title: "Cao Hùng",
                desc: "Tham quan chùa Phật Quang Sơn."
            },
            {
                day: "Ngày 5",
                title: "Về nước",
                desc: "Mua sắm quà lưu niệm, ra sân bay."
            }
        ]
    }
];
const allTours = [
    ...domesticTours,
    ...abroadTours
];
const regionIcons = {
    "Miền Bắc": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mountain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mountain$3e$__["Mountain"],
    "Miền Trung": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"],
    "Miền Nam": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__["Palmtree"],
    "Đông Nam Á": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__["Waves"],
    "Đông Bắc Á": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
    "Khác": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"]
};
const formatVND = (n)=>n.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    });

})()),
"[project]/components/TourCard.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>TourCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/users-round.js [app-client] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/data/tours.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
;
// Nhãn khuyến mãi: mỗi loại một màu riêng, tất cả đều đạt tương phản với chữ trắng
const tagStyles = {
    "Bán chạy": "bg-teal-600",
    "Mới": "bg-ocean-600",
    "Giảm giá": "bg-sunset-600",
    "Cao cấp": "bg-deep-800"
};
function TourCard({ tour, basePath, index = 0 }) {
    const discount = tour.oldPrice ? Math.round((1 - tour.price / tour.oldPrice) * 100) : null;
    // Còn ít chỗ thì mới cảnh báo — dùng màu ấm để tạo cảm giác cấp thiết đúng lúc,
    // tránh bôi đỏ mọi thẻ khiến tín hiệu mất giá trị
    const sapHetCho = typeof tour.seatsLeft === "number" && tour.seatsLeft > 0 && tour.seatsLeft <= 5;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 24
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once: true,
            amount: 0.2
        },
        transition: {
            duration: 0.55,
            delay: index % 6 * 0.06,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        whileHover: {
            y: -8
        },
        className: "card-surface group flex flex-col overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: `${basePath}/${tour.slug}`,
            className: "flex flex-1 flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-52 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: tour.image,
                            alt: tour.name,
                            fill: true,
                            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                            className: "object-cover transition-transform duration-700 ease-enter group-hover:scale-110"
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-t from-deep-950/55 via-deep-950/5 to-transparent transition-opacity duration-500 group-hover:from-deep-950/70"
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        tour.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `absolute left-3 top-3 rounded-full ${tagStyles[tour.tag] || "bg-ocean-600"} px-3 py-1 text-xs font-semibold text-white shadow-sm`,
                            children: tour.tag
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, this),
                        discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sunset-700 shadow-sm",
                            children: [
                                "−",
                                discount,
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-x-3 bottom-3 flex items-center gap-1 text-xs font-medium text-white drop-shadow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                    className: "h-3.5 w-3.5 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: [
                                        tour.region,
                                        tour.country ? ` · ${tour.country}` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 translate-x-2 place-items-center rounded-full bg-white/95 opacity-0 shadow backdrop-blur transition-all duration-300 ease-enter group-hover:translate-x-0 group-hover:opacity-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                className: "h-4 w-4 text-ocean-700"
                            }, void 0, false, {
                                fileName: "[project]/components/TourCard.jsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/TourCard.jsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 flex-col p-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "line-clamp-2 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700",
                            children: tour.name
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-subtle",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                            className: "h-3.5 w-3.5 text-ocean-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        tour.days
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1 font-medium text-ink-muted",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "h-3.5 w-3.5 fill-gold-500 text-gold-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this),
                                        tour.rating > 0 ? tour.rating : "Mới",
                                        tour.reviews > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-ink-subtle",
                                            children: [
                                                "(",
                                                tour.reviews,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 85,
                                            columnNumber: 36
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        (sapHetCho || tour.startDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mt-3 flex items-center gap-1.5 text-xs font-medium ${sapHetCho ? "text-sunset-700" : "text-ink-subtle"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                    className: "h-3.5 w-3.5 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: [
                                        sapHetCho ? `Chỉ còn ${tour.seatsLeft} chỗ` : tour.seatsLeft ? `Còn ${tour.seatsLeft} chỗ` : "Nhận đặt chỗ",
                                        tour.startDate ? ` · Khởi hành ${tour.startDate}` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 93,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-auto flex items-end justify-between gap-3 border-t border-ocean-50 pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        tour.oldPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-ink-subtle line-through",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.oldPrice)
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 103,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-display text-xl font-bold text-ocean-700",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.price)
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        tour.departure && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "truncate text-xs text-ink-subtle",
                                            children: tour.departure
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 rounded-full border border-ocean-200 px-4 py-2 text-xs font-semibold text-ocean-700 transition-colors duration-300 group-hover:border-sunset-600 group-hover:bg-sunset-600 group-hover:text-white",
                                    children: "Xem chi tiết"
                                }, void 0, false, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/TourCard.jsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/TourCard.jsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/TourCard.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c = TourCard;
var _c;
__turbopack_refresh__.register(_c, "TourCard");

})()),
"[project]/components/SectionReveal.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>SectionReveal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
function SectionReveal({ children, className = "", delay = 0, y = 28, once = true, as = "div" }) {
    const Comp = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"][as] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        initial: {
            opacity: 0,
            y
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once,
            amount: 0.25
        },
        transition: {
            duration: 0.7,
            delay,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/SectionReveal.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = SectionReveal;
var _c;
__turbopack_refresh__.register(_c, "SectionReveal");

})()),
"[project]/components/pages/TourListPage.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>TourListPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.js [app-client] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PageHero$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/PageHero.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TourCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/TourCard.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/SectionReveal.jsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
;
function TourListPage({ tours, basePath, title, eyebrow, description, regions, orbitImages, matchFilter }) {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const initialQuery = searchParams.get("q") || "";
    const initialRegion = searchParams.get("region") || "Tất cả";
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialQuery);
    const [searchOpen, setSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Boolean(initialQuery));
    const [region, setRegion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialRegion);
    const isMatch = matchFilter || ((t, r)=>t.region === r);
    // Khi đến từ thanh lọc ở trang chi tiết tour (?scroll=1), cuộn thẳng xuống khu vực kết quả.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (searchParams.get("scroll")) {
            requestAnimationFrame(()=>{
                document.getElementById("ket-qua-tour")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    }, [
        searchParams
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return tours.filter((t)=>{
            const matchQuery = query.trim() === "" || t.name.toLowerCase().includes(query.toLowerCase()) || (t.country || "").toLowerCase().includes(query.toLowerCase());
            const matchRegion = region === "Tất cả" || isMatch(t, region);
            return matchQuery && matchRegion;
        });
    }, [
        tours,
        query,
        region
    ]);
    // Có đang lọc gì không — dùng để hiện nút xoá lọc
    const dangLoc = query.trim() !== "" || region !== "Tất cả";
    const xoaLoc = ()=>{
        setQuery("");
        setRegion("Tất cả");
        setSearchOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PageHero$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                eyebrow: eyebrow,
                title: title,
                description: description,
                crumbs: [
                    {
                        label: title
                    }
                ],
                orbitImages: orbitImages
            }, void 0, false, {
                fileName: "[project]/components/pages/TourListPage.jsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "ket-qua-tour",
                className: "scroll-mt-20 bg-foam py-14 sm:py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-5 sm:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "sticky top-20 z-20 mb-8 rounded-2xl border border-ocean-100 bg-white/92 p-4 shadow-card backdrop-blur-lg sm:p-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        mode: "wait",
                                        initial: false,
                                        children: searchOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                width: 44,
                                                opacity: 0
                                            },
                                            animate: {
                                                width: 250,
                                                opacity: 1
                                            },
                                            exit: {
                                                width: 44,
                                                opacity: 0
                                            },
                                            transition: {
                                                duration: 0.25,
                                                ease: [
                                                    0.22,
                                                    1,
                                                    0.36,
                                                    1
                                                ]
                                            },
                                            className: "relative shrink-0 overflow-hidden",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 83,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    autoFocus: true,
                                                    value: query,
                                                    onChange: (e)=>setQuery(e.target.value),
                                                    placeholder: "Tìm theo tên tour hoặc điểm đến...",
                                                    className: "w-full rounded-full border border-ocean-100 bg-ocean-50/40 py-2.5 pl-10 pr-9 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 84,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setSearchOpen(false);
                                                        setQuery("");
                                                    },
                                                    className: "tap-44 absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-deep-800",
                                                    "aria-label": "Đóng tìm kiếm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourListPage.jsx",
                                                        lineNumber: 96,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 91,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, "input", true, {
                                            fileName: "[project]/components/pages/TourListPage.jsx",
                                            lineNumber: 75,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                            initial: {
                                                opacity: 0
                                            },
                                            animate: {
                                                opacity: 1
                                            },
                                            exit: {
                                                opacity: 0
                                            },
                                            onClick: ()=>setSearchOpen(true),
                                            className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ocean-50 text-ocean-700 transition-colors hover:bg-ocean-100",
                                            "aria-label": "Mở tìm kiếm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourListPage.jsx",
                                                lineNumber: 109,
                                                columnNumber: 21
                                            }, this)
                                        }, "icon", false, {
                                            fileName: "[project]/components/pages/TourListPage.jsx",
                                            lineNumber: 100,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourListPage.jsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                className: "h-4 w-4 shrink-0 text-ocean-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourListPage.jsx",
                                                lineNumber: 115,
                                                columnNumber: 17
                                            }, this),
                                            regions.map((r)=>{
                                                const dangChon = region === r;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setRegion(r),
                                                    "aria-pressed": dangChon,
                                                    className: `relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ease-enter ${dangChon ? "bg-ocean-600 text-white shadow-[0_4px_14px_-4px_rgba(1,105,169,0.6)]" : "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"}`,
                                                    children: r
                                                }, r, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 119,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/pages/TourListPage.jsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        children: dangLoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                            initial: {
                                                opacity: 0,
                                                scale: 0.9
                                            },
                                            animate: {
                                                opacity: 1,
                                                scale: 1
                                            },
                                            exit: {
                                                opacity: 0,
                                                scale: 0.9
                                            },
                                            onClick: xoaLoc,
                                            className: "flex shrink-0 items-center gap-1.5 rounded-full border border-sunset-200 bg-sunset-50 px-3.5 py-2 text-xs font-semibold text-sunset-700 transition-colors hover:bg-sunset-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 145,
                                                    columnNumber: 21
                                                }, this),
                                                " Xoá lọc"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourListPage.jsx",
                                            lineNumber: 138,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourListPage.jsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/pages/TourListPage.jsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourListPage.jsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-display text-2xl font-bold text-ocean-700",
                                    children: filtered.length
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-ink-muted",
                                    children: [
                                        "tour phù hợp",
                                        region !== "Tất cả" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                " tại ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "font-semibold text-ink",
                                                    children: region
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 157,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        query.trim() !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                " cho từ khoá “",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "font-semibold text-ink",
                                                    children: query
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                                    lineNumber: 158,
                                                    columnNumber: 61
                                                }, this),
                                                "”"
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourListPage.jsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-3xl border border-dashed border-ocean-200 bg-white py-20 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ocean-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                        className: "h-8 w-8 text-ocean-300"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourListPage.jsx",
                                        lineNumber: 165,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-5 font-display text-xl font-semibold text-deep-900",
                                    children: "Không tìm thấy tour phù hợp"
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mx-auto mt-2 max-w-sm text-sm text-ink-muted",
                                    children: "Thử bỏ bớt điều kiện lọc, hoặc để chúng tôi gợi ý hành trình khác cho bạn."
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: xoaLoc,
                                    className: "btn-cta mt-7 !px-6 !py-3 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourListPage.jsx",
                                            lineNumber: 172,
                                            columnNumber: 17
                                        }, this),
                                        " Xem tất cả tour"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourListPage.jsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
                            children: filtered.map((tour, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TourCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    tour: tour,
                                    basePath: basePath,
                                    index: i
                                }, tour.slug, false, {
                                    fileName: "[project]/components/pages/TourListPage.jsx",
                                    lineNumber: 178,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourListPage.jsx",
                            lineNumber: 176,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourListPage.jsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourListPage.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/pages/TourListPage.jsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(TourListPage, "/qRPZ/82DHae2Vk1MMk1UQsoQzM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = TourListPage;
var _c;
__turbopack_refresh__.register(_c, "TourListPage");

})()),
"[project]/data/filters.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Danh mục lọc dùng chung — trang danh sách tour (TourListPage) và thanh tìm kiếm
// trong trang chi tiết tour (TourDetail) cùng đọc từ đây để luôn đồng bộ.
__turbopack_esm__({
    "abroadRegions": ()=>abroadRegions,
    "domesticRegions": ()=>domesticRegions,
    "matchByCountry": ()=>matchByCountry
});
const domesticRegions = [
    "Tất cả",
    "Miền Bắc",
    "Miền Trung",
    "Miền Nam"
];
const abroadRegions = [
    "Tất cả",
    "Thái Lan",
    "Singapore",
    "Nhật Bản",
    "Hàn Quốc",
    "Tour lạ",
    "Mỹ",
    "Úc"
];
// Các quốc gia phổ biến đã có nhãn riêng; "Tour lạ" gom các điểm đến còn lại
// (Trung Quốc, Đài Loan...) — những tuyến ít người đi hơn nhưng độc đáo.
const mainCountries = [
    "Thái Lan",
    "Singapore",
    "Nhật Bản",
    "Hàn Quốc"
];
const matchByCountry = (tour, selected)=>{
    if (selected === "Tour lạ") return !mainCountries.includes(tour.country);
    return tour.country === selected;
};

})()),
"[project]/components/pages/DomesticTours.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>DomesticTours
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pages$2f$TourListPage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/pages/TourListPage.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$filters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/data/filters.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
function DomesticTours({ tours = [] }) {
    const orbitImages = tours.length ? Array.from({
        length: 10
    }, (_, i)=>tours[i % tours.length].image) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$pages$2f$TourListPage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        tours: tours,
        basePath: "/tour-trong-nuoc",
        eyebrow: "Tour trong nước",
        title: "Khám phá Việt Nam từ Bắc chí Nam",
        description: "Từ vịnh Hạ Long kỳ vĩ đến đảo Ngọc Phú Quốc rực nắng — mỗi vùng đất đều mang một câu chuyện riêng.",
        regions: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$filters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["domesticRegions"],
        orbitImages: orbitImages
    }, void 0, false, {
        fileName: "[project]/components/pages/DomesticTours.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = DomesticTours;
var _c;
__turbopack_refresh__.register(_c, "DomesticTours");

})()),
"[project]/app/(site)/tour-trong-nuoc/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_3e0831._.js.map