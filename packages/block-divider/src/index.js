import React from 'react';
import { z } from 'zod';
const COLOR_SCHEMA = z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .optional();
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
export const DividerPropsSchema = z.object({
    style: z
        .object({
        backgroundColor: COLOR_SCHEMA,
        padding: PADDING_SCHEMA,
    })
        .optional()
        .nullable(),
    props: z
        .object({
        lineColor: COLOR_SCHEMA,
        lineHeight: z.number().optional().nullable(),
    })
        .optional()
        .nullable(),
});
export const DividerPropsDefaults = {
    lineHeight: 1,
    lineColor: '#333333',
};
export function Divider({ style, props }) {
    var _a, _b, _c;
    const st = {
        padding: getPadding(style === null || style === void 0 ? void 0 : style.padding),
        backgroundColor: (_a = style === null || style === void 0 ? void 0 : style.backgroundColor) !== null && _a !== void 0 ? _a : undefined,
    };
    const borderTopWidth = (_b = props === null || props === void 0 ? void 0 : props.lineHeight) !== null && _b !== void 0 ? _b : DividerPropsDefaults.lineHeight;
    const borderTopColor = (_c = props === null || props === void 0 ? void 0 : props.lineColor) !== null && _c !== void 0 ? _c : DividerPropsDefaults.lineColor;
    return (React.createElement("div", { style: st },
        React.createElement("hr", { style: {
                width: '100%',
                border: 'none',
                borderTop: `${borderTopWidth}px solid ${borderTopColor}`,
                margin: 0,
            } })));
}
//# sourceMappingURL=index.js.map