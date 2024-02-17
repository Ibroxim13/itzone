import React from 'react';
import { Flex, Spin } from 'antd';

export default function SpinLoader({ height = "calc(100vh - 161px)" }) {
    const SpinStyle = { height: height, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }
    return (
        <Flex style={SpinStyle}>
            <Spin size="large" />
        </Flex>
    )
}
