import React, { useState } from 'react';
import { HeightOutlined } from '@mui/icons-material';
import { DividerPropsDefaults, DividerPropsSchema } from '@usewaypoint/block-divider';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import SliderInput from './helpers/inputs/SliderInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function DividerSidebarPanel({ data, setData }) {
    var _a, _b, _c, _d;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = DividerPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    const lineColor = (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.lineColor) !== null && _b !== void 0 ? _b : DividerPropsDefaults.lineColor;
    const lineHeight = (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.lineHeight) !== null && _d !== void 0 ? _d : DividerPropsDefaults.lineHeight;
    return (React.createElement(BaseSidebarPanel, { title: "Divider block" },
        React.createElement(ColorInput, { label: "Color", defaultValue: lineColor, onChange: (lineColor) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { lineColor }) })) }),
        React.createElement(SliderInput, { label: "Height", iconLabel: React.createElement(HeightOutlined, { sx: { color: 'text.secondary' } }), units: "px", step: 1, min: 1, max: 24, defaultValue: lineHeight, onChange: (lineHeight) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { lineHeight }) })) }),
        React.createElement(MultiStylePropertyPanel, { names: ['backgroundColor', 'padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=DividerSidebarPanel.js.map