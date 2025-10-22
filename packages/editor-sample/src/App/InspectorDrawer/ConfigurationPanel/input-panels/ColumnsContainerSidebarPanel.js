import React, { useState } from 'react';
import { SpaceBarOutlined, VerticalAlignBottomOutlined, VerticalAlignCenterOutlined, VerticalAlignTopOutlined, } from '@mui/icons-material';
import { ToggleButton } from '@mui/material';
import ColumnsContainerPropsSchema from '../../../../documents/blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColumnWidthsInput from './helpers/inputs/ColumnWidthsInput';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import SliderInput from './helpers/inputs/SliderInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function ColumnsContainerPanel({ data, setData }) {
    var _a, _b, _c, _d, _e, _f;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = ColumnsContainerPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    return (React.createElement(BaseSidebarPanel, { title: "Columns block" },
        React.createElement(RadioGroupInput, { label: "Number of columns", defaultValue: ((_a = data.props) === null || _a === void 0 ? void 0 : _a.columnsCount) === 2 ? '2' : '3', onChange: (v) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { columnsCount: v === '2' ? 2 : 3 }) }));
            } },
            React.createElement(ToggleButton, { value: "2" }, "2"),
            React.createElement(ToggleButton, { value: "3" }, "3")),
        React.createElement(ColumnWidthsInput, { defaultValue: (_b = data.props) === null || _b === void 0 ? void 0 : _b.fixedWidths, onChange: (fixedWidths) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { fixedWidths }) }));
            } }),
        React.createElement(SliderInput, { label: "Columns gap", iconLabel: React.createElement(SpaceBarOutlined, { sx: { color: 'text.secondary' } }), units: "px", step: 4, marks: true, min: 0, max: 80, defaultValue: (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.columnsGap) !== null && _d !== void 0 ? _d : 0, onChange: (columnsGap) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { columnsGap }) })) }),
        React.createElement(RadioGroupInput, { label: "Alignment", defaultValue: (_f = (_e = data.props) === null || _e === void 0 ? void 0 : _e.contentAlignment) !== null && _f !== void 0 ? _f : 'middle', onChange: (contentAlignment) => {
                updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { contentAlignment }) }));
            } },
            React.createElement(ToggleButton, { value: "top" },
                React.createElement(VerticalAlignTopOutlined, { fontSize: "small" })),
            React.createElement(ToggleButton, { value: "middle" },
                React.createElement(VerticalAlignCenterOutlined, { fontSize: "small" })),
            React.createElement(ToggleButton, { value: "bottom" },
                React.createElement(VerticalAlignBottomOutlined, { fontSize: "small" }))),
        React.createElement(MultiStylePropertyPanel, { names: ['backgroundColor', 'padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=ColumnsContainerSidebarPanel.js.map