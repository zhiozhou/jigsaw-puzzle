import React, { useState, useMemo } from 'react'
import Plate from './component/plate/Plate'
import Layer from './component/layer/Layer'


var xstart, ystart,  // 点击开始位置
    layerPatch,
    _layerStyle,        
    _patchs         // 碎片位置

const Game = () => {

    console.log('game render')

    const xnum = 3, ynum = 3
    const url = "http://www.zhousb.cn/upload/jagsaw/1.jpg"
    const [level, setLevel] = useState(1)
    const [layerStyle, setLayerStyle] = useState(null)
    const [patchs, setPatchs] = useState(null)


    function handleTouchStart({ target, changedTouches }) {

        // 初始化碎片位置
        if (!_patchs) {
            _patchs = []
            for (var patch of target.parentNode.children) {
                let { top, left, width, height } = patch.getBoundingClientRect()
                _patchs.push({
                    top,
                    left,
                    width,
                    height
                })
            }
        }


        // 只有一根手指
        if (1 !== changedTouches.length) {
            return false
        }
        xstart = changedTouches[0].pageX
        ystart = changedTouches[0].pageY

        let { top, left, width, height } = target.getBoundingClientRect()
        let { backgroundImage, backgroundPosition } = target.style

        layerPatch = {
            sort: target.getAttribute('sort'),
            index: target.getAttribute('index'),
            style: _layerStyle = {
                top,
                left,
                width,
                height,
                backgroundImage,
                backgroundPosition,
            }
        }
        setLayerStyle(_layerStyle)
    }

    function handleTouchMove({ changedTouches }) {
        if (1 !== changedTouches.length) {
            return false
        }

        let { pageX: xnow, pageY: ynow } = changedTouches[0]
        _layerStyle = copy(_layerStyle)
        _layerStyle.top = ynow - (ystart - layerPatch.style.top)
        _layerStyle.left = xnow - (xstart - layerPatch.style.left)
        setLayerStyle(_layerStyle)
    }

    function handleTouchEnd() {
        let { top: y, left: x } = _layerStyle
        for (var patch of _patchs) {

            let { top, left } = patch,
                bottom = top + patch.height,
                right = left + patch.width

            if (left < x && right > x && top < y & bottom > y) {
                // let copy = copy(patchs)
                console.log(patch)
                break
            }
        }
    }


    useMemo(() => {
        let sort = 0,
            patchs = [],
            width = `${96 / xnum}%`, // 100 - 4个border
            height = `${96 / ynum}%`,
            backgroundImage = `url(${url})`

        // 初始化碎片
        Array(xnum).fill().map((xitem, x) =>
            Array(ynum).fill().map((yitem, y) => {
                patchs.push({
                    sort,
                    style: {
                        width,
                        height,
                        backgroundImage,
                        backgroundPosition: `${-y * 79.6 / xnum}vw ${-x * 79.6 / ynum}vw` // 80 - 0.4的border
                    }
                })
                return sort++
            })
        )
        setPatchs(patchs)
    }, [level])




    const plate = useMemo(() => {
        return (<Plate
            patchs={patchs}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
        />)
    }, [patchs]),

        layer = useMemo(() =>
            <Layer style={layerStyle} />
            , [layerStyle])

    return (
        <>
            {plate}
            {layer}
        </>
    )
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


export default Game