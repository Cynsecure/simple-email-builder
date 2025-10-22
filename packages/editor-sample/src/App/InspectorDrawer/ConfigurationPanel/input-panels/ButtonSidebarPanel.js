import React, { useState } from 'react';
import { ToggleButton } from '@mui/material';
import { ButtonPropsDefaults, ButtonPropsSchema } from '@usewaypoint/block-button';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function ButtonSidebarPanel({ data, setData }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = ButtonPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    const text = (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ButtonPropsDefaults.text;
    const url = (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : ButtonPropsDefaults.url;
    const fullWidth = (_f = (_e = data.props) === null || _e === void 0 ? void 0 : _e.fullWidth) !== null && _f !== void 0 ? _f : ButtonPropsDefaults.fullWidth;
    const size = (_h = (_g = data.props) === null || _g === void 0 ? void 0 : _g.size) !== null && _h !== void 0 ? _h : ButtonPropsDefaults.size;
    const buttonStyle = (_k = (_j = data.props) === null || _j === void 0 ? void 0 : _j.buttonStyle) !== null && _k !== void 0 ? _k : ButtonPropsDefaults.buttonStyle;
    const buttonTextColor = (_m = (_l = data.props) === null || _l === void 0 ? void 0 : _l.buttonTextColor) !== null && _m !== void 0 ? _m : ButtonPropsDefaults.buttonTextColor;
    const buttonBackgroundColor = (_p = (_o = data.props) === null || _o === void 0 ? void 0 : _o.buttonBackgroundColor) !== null && _p !== void 0 ? _p : ButtonPropsDefaults.buttonBackgroundColor;
    return (React.createElement(BaseSidebarPanel, { title: "Button block" },
        React.createElement(TextInput, { label: "Text", defaultValue: text, onChange: (text) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { text }) })) }),
        React.createElement(TextInput, { label: "Url", defaultValue: url, onChange: (url) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { url }) })) }),
        React.createElement(RadioGroupInput, { label: "Width", defaultValue: fullWidth ? 'FULL_WIDTH' : 'AUTO', onChange: (v) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { fullWidth: v === 'FULL_WIDTH' }) })) },
            React.createElement(ToggleButton, { value: "FULL_WIDTH" }, "Full"),
            React.createElement(ToggleButton, { value: "AUTO" }, "Auto")),
        React.createElement(RadioGroupInput, { label: "Size", defaultValue: size, onChange: (size) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { size }) })) },
            React.createElement(ToggleButton, { value: "x-small" }, "Xs"),
            React.createElement(ToggleButton, { value: "small" }, "Sm"),
            React.createElement(ToggleButton, { value: "medium" }, "Md"),
            React.createElement(ToggleButton, { value: "large" }, "Lg")),
        React.createElement(RadioGroupInput, { label: "Style", defaultValue: buttonStyle, onChange: (buttonStyle) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { buttonStyle }) })) },
            React.createElement(ToggleButton, { value: "rectangle" }, "Rectangle"),
            React.createElement(ToggleButton, { value: "rounded" }, "Rounded"),
            React.createElement(ToggleButton, { value: "pill" }, "Pill")),
        React.createElement(ColorInput, { label: "Text color", defaultValue: buttonTextColor, onChange: (buttonTextColor) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { buttonTextColor }) })) }),
        React.createElement(ColorInput, { label: "Button color", defaultValue: buttonBackgroundColor, onChange: (buttonBackgroundColor) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { buttonBackgroundColor }) })) }),
        React.createElement(MultiStylePropertyPanel, { names: ['backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=ButtonSidebarPanel.js.map