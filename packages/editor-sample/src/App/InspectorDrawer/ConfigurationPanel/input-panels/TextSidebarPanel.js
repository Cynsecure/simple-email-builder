import React, { useState } from 'react';
import { TextPropsSchema } from '@usewaypoint/block-text';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function TextSidebarPanel({ data, setData }) {
    var _a, _b, _c, _d;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = TextPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    return (React.createElement(BaseSidebarPanel, { title: "Text block" },
        React.createElement(TextInput, { label: "Content", rows: 5, defaultValue: (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '', onChange: (text) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { text }) })) }),
        React.createElement(BooleanInput, { label: "Markdown", defaultValue: (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.markdown) !== null && _d !== void 0 ? _d : false, onChange: (markdown) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { markdown }) })) }),
        React.createElement(MultiStylePropertyPanel, { names: ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=TextSidebarPanel.js.map