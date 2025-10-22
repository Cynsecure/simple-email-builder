import React, { useState } from 'react';
import { AspectRatioOutlined } from '@mui/icons-material';
import { ToggleButton } from '@mui/material';
import { AvatarPropsDefaults, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function AvatarSidebarPanel({ data, setData }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = AvatarPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    const size = (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : AvatarPropsDefaults.size;
    const imageUrl = (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.imageUrl) !== null && _d !== void 0 ? _d : AvatarPropsDefaults.imageUrl;
    const alt = (_f = (_e = data.props) === null || _e === void 0 ? void 0 : _e.alt) !== null && _f !== void 0 ? _f : AvatarPropsDefaults.alt;
    const shape = (_h = (_g = data.props) === null || _g === void 0 ? void 0 : _g.shape) !== null && _h !== void 0 ? _h : AvatarPropsDefaults.shape;
    return (React.createElement(BaseSidebarPanel, { title: "Avatar block" },
        React.createElement(SliderInput, { label: "Size", iconLabel: React.createElement(AspectRatioOutlined, { sx: { color: 'text.secondary' } }), units: "px", step: 3, min: 32, max: 256, defaultValue: size, onChange: (size) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { size }) }));
            } }),
        React.createElement(RadioGroupInput, { label: "Shape", defaultValue: shape, onChange: (shape) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { shape }) }));
            } },
            React.createElement(ToggleButton, { value: "circle" }, "Circle"),
            React.createElement(ToggleButton, { value: "square" }, "Square"),
            React.createElement(ToggleButton, { value: "rounded" }, "Rounded")),
        React.createElement(TextInput, { label: "Image URL", defaultValue: imageUrl, onChange: (imageUrl) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { imageUrl }) }));
            } }),
        React.createElement(TextInput, { label: "Alt text", defaultValue: alt, onChange: (alt) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { alt }) }));
            } }),
        React.createElement(MultiStylePropertyPanel, { names: ['textAlign', 'padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=AvatarSidebarPanel.js.map