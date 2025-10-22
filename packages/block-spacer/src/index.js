import React from 'react';
import { z } from 'zod';
export const SpacerPropsSchema = z.object({
    props: z
        .object({
        height: z.number().gte(0).optional().nullish(),
    })
        .optional()
        .nullable(),
});
export const SpacerPropsDefaults = {
    height: 16,
};
export function Spacer({ props }) {
    var _a;
    const style = {
        height: (_a = props === null || props === void 0 ? void 0 : props.height) !== null && _a !== void 0 ? _a : SpacerPropsDefaults.height,
    };
    return React.createElement("div", { style: style });
}
//# sourceMappingURL=index.js.map