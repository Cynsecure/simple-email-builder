import React, { useState } from 'react';
import { VerticalAlignBottomOutlined, VerticalAlignCenterOutlined, VerticalAlignTopOutlined, } from '@mui/icons-material';
import { Stack, ToggleButton } from '@mui/material';
import { ImagePropsSchema } from '@usewaypoint/block-image';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function ImageSidebarPanel({ data, setData }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = ImagePropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    return (React.createElement(BaseSidebarPanel, { title: "Image block" },
        React.createElement(TextInput, { label: "Source URL", defaultValue: (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '', onChange: (v) => {
                const url = v.trim().length === 0 ? null : v.trim();
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { url }) }));
            } }),
        React.createElement(TextInput, { label: "Alt text", defaultValue: (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.alt) !== null && _d !== void 0 ? _d : '', onChange: (alt) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { alt }) })) }),
        React.createElement(TextInput, { label: "Click through URL", defaultValue: (_f = (_e = data.props) === null || _e === void 0 ? void 0 : _e.linkHref) !== null && _f !== void 0 ? _f : '', onChange: (v) => {
                const linkHref = v.trim().length === 0 ? null : v.trim();
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { linkHref }) }));
            } }),
        React.createElement(Stack, { direction: "row", spacing: 2 },
            React.createElement(TextDimensionInput, { label: "Width", defaultValue: (_g = data.props) === null || _g === void 0 ? void 0 : _g.width, onChange: (width) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { width }) })) }),
            React.createElement(TextDimensionInput, { label: "Height", defaultValue: (_h = data.props) === null || _h === void 0 ? void 0 : _h.height, onChange: (height) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { height }) })) })),
        React.createElement(RadioGroupInput, { label: "Alignment", defaultValue: (_k = (_j = data.props) === null || _j === void 0 ? void 0 : _j.contentAlignment) !== null && _k !== void 0 ? _k : 'middle', onChange: (contentAlignment) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { contentAlignment }) })) },
            React.createElement(ToggleButton, { value: "top" },
                React.createElement(VerticalAlignTopOutlined, { fontSize: "small" })),
            React.createElement(ToggleButton, { value: "middle" },
                React.createElement(VerticalAlignCenterOutlined, { fontSize: "small" })),
            React.createElement(ToggleButton, { value: "bottom" },
                React.createElement(VerticalAlignBottomOutlined, { fontSize: "small" }))),
        React.createElement(MultiStylePropertyPanel, { names: ['backgroundColor', 'textAlign', 'padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=ImageSidebarPanel.js.map