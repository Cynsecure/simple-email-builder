import React, { useState } from 'react';
import { RoundedCornerOutlined } from '@mui/icons-material';
import EmailLayoutPropsSchema from '../../../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput, { NullableColorInput } from './helpers/inputs/ColorInput';
import { NullableFontFamily } from './helpers/inputs/FontFamily';
import SliderInput from './helpers/inputs/SliderInput';
export default function EmailLayoutSidebarFields({ data, setData }) {
    var _a, _b, _c, _d, _e;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = EmailLayoutPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    return (React.createElement(BaseSidebarPanel, { title: "Global" },
        React.createElement(ColorInput, { label: "Backdrop color", defaultValue: (_a = data.backdropColor) !== null && _a !== void 0 ? _a : '#F5F5F5', onChange: (backdropColor) => updateData(Object.assign(Object.assign({}, data), { backdropColor })) }),
        React.createElement(ColorInput, { label: "Canvas color", defaultValue: (_b = data.canvasColor) !== null && _b !== void 0 ? _b : '#FFFFFF', onChange: (canvasColor) => updateData(Object.assign(Object.assign({}, data), { canvasColor })) }),
        React.createElement(NullableColorInput, { label: "Canvas border color", defaultValue: (_c = data.borderColor) !== null && _c !== void 0 ? _c : null, onChange: (borderColor) => updateData(Object.assign(Object.assign({}, data), { borderColor })) }),
        React.createElement(SliderInput, { iconLabel: React.createElement(RoundedCornerOutlined, null), units: "px", step: 4, marks: true, min: 0, max: 48, label: "Canvas border radius", defaultValue: (_d = data.borderRadius) !== null && _d !== void 0 ? _d : 0, onChange: (borderRadius) => updateData(Object.assign(Object.assign({}, data), { borderRadius })) }),
        React.createElement(NullableFontFamily, { label: "Font family", defaultValue: "MODERN_SANS", onChange: (fontFamily) => updateData(Object.assign(Object.assign({}, data), { fontFamily })) }),
        React.createElement(ColorInput, { label: "Text color", defaultValue: (_e = data.textColor) !== null && _e !== void 0 ? _e : '#262626', onChange: (textColor) => updateData(Object.assign(Object.assign({}, data), { textColor })) })));
}
//# sourceMappingURL=EmailLayoutSidebarPanel.js.map