import React from "react"
import { View } from "react-native"

export const Grid: React.FunctionComponent<{
    width: number,
    height: number,
    renderChild: (x: number, y: number) => React.ReactElement
}> = ({ width, height, renderChild }) => {
    let children = [];
    for (let i = 0; i < height; i++) {
        children.push(<Row key={i} width={width} renderChild={(x) => renderChild(x, i)}/>);
    }
    return <View style={{ flexDirection: "column" }}>
        { children }
    </View>
}

const Row: React.FunctionComponent<{
    width: number,
    renderChild: (x: number) => React.ReactElement
}> = ({width, renderChild}) => {
    let children = [];
    for (let i = 0; i < width; i++) {
        children.push(<View key={i}>{renderChild(i)}</View>);
    }
    return <View style={{ flexDirection: "row" }}>
        { children }
    </View>
}

