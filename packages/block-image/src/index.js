import React from 'react';
import { z } from 'zod';
const PADDING_SCHEMA = z
    .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
})
    .optional()
    .nullable();
const getPadding = (padding) => padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;
export const ImagePropsSchema = z.object({
    style: z
        .object({
        padding: PADDING_SCHEMA,
        backgroundColor: z
            .string()
            .regex(/^#[0-9a-fA-F]{6}$/)
            .optional()
            .nullable(),
        textAlign: z.enum(['center', 'left', 'right']).optional().nullable(),
    })
        .optional()
        .nullable(),
    props: z
        .object({
        width: z.number().optional().nullable(),
        height: z.number().optional().nullable(),
        url: z.string().optional().nullable(),
        alt: z.string().optional().nullable(),
        linkHref: z.string().optional().nullable(),
        contentAlignment: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
    })
        .optional()
        .nullable(),
});
export function Image({ style, props }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const sectionStyle = {
        padding: getPadding(style === null || style === void 0 ? void 0 : style.padding),
        backgroundColor: (_a = style === null || style === void 0 ? void 0 : style.backgroundColor) !== null && _a !== void 0 ? _a : undefined,
        textAlign: (_b = style === null || style === void 0 ? void 0 : style.textAlign) !== null && _b !== void 0 ? _b : undefined,
    };
    const linkHref = (_c = props === null || props === void 0 ? void 0 : props.linkHref) !== null && _c !== void 0 ? _c : null;
    const width = (_d = props === null || props === void 0 ? void 0 : props.width) !== null && _d !== void 0 ? _d : undefined;
    const height = (_e = props === null || props === void 0 ? void 0 : props.height) !== null && _e !== void 0 ? _e : undefined;
    const imageElement = (React.createElement("img", { alt: (_f = props === null || props === void 0 ? void 0 : props.alt) !== null && _f !== void 0 ? _f : '', src: (_g = props === null || props === void 0 ? void 0 : props.url) !== null && _g !== void 0 ? _g : '', width: width, height: height, style: {
            width,
            height,
            outline: 'none',
            border: 'none',
            textDecoration: 'none',
            verticalAlign: (_h = props === null || props === void 0 ? void 0 : props.contentAlignment) !== null && _h !== void 0 ? _h : 'middle',
            display: 'inline-block',
            maxWidth: '100%',
        } }));
    if (!linkHref) {
        return React.createElement("div", { style: sectionStyle }, imageElement);
    }
    return (React.createElement("div", { style: sectionStyle },
        React.createElement("a", { href: linkHref, style: { textDecoration: 'none' }, target: "_blank" }, imageElement)));
}
//# sourceMappingURL=index.js.map