(() => {
    const addInput = (selector) => {
        $(selector).each(function(index, element) {
            const config = $(element).data();

            const maxHeight = 200;
            const maxWidth = 50;
            const knobRadius = 8;
            const knobMargin = knobRadius;
            const tankStroke = 1;
            const maxLevelValue = parseInt(config.max);
            const minLevelValue = parseInt(config.min);
            const levelTickValues = _.range(minLevelValue, maxLevelValue + 1);
            const levelYSpacing = maxHeight / maxLevelValue;
            const tickWidth = knobRadius + 6;
    
            const tank = {
                stage: new Konva.Stage({
                    container: element,
                    width: maxWidth + knobRadius + 2,
                    height: maxHeight + (knobRadius * 2) + 2
                }),
                layer: new Konva.Layer(),
                waterLevel: new Konva.Rect({
                    fill: "aquamarine",
                    x: knobMargin,
                    opacity: .85,
                }),
                tank: new Konva.Rect({
                    x: knobMargin,
                    y: knobMargin,
                    width: maxWidth,
                    height: maxHeight,
                    fill: "azure",
                    opacity: 0.25,
                    stroke: "black",
                    strokeWidth: tankStroke
                }),
                knob: new Konva.Circle({
                    fill: "darkblue",
                    radius: knobRadius,
                    draggable: true,
                    dragBoundFunc: function(pos) {
                        return {
                            y: pos.y,
                            x: tank.knob.absolutePosition().x
                        }
                    }
                }),
                ticks: levelTickValues.map(v => new Konva.Rect({
                    name: (maxLevelValue - v),
                    x: knobMargin,
                    y: knobMargin + (v * levelYSpacing) - 1,
                    width: tickWidth,
                    height: 1,
                    fill: "black"
                }))
            };
    
            tank.layer.add(tank.tank);
            tank.layer.add(tank.waterLevel);
            tank.layer.add(tank.knob);
            tank.ticks.forEach(t => tank.layer.add(t));
            tank.stage.add(tank.layer);
    
            const rectsIntersect = (r1, r2) => {
                return !(
                    r2.x > r1.x + r1.width ||
                    r2.x + r2.width < r1.x ||
                    r2.y > r1.y + r1.height ||
                    r2.y + r2.height < r1.y
                  );
            }
    
            const setTankLevel = (level) => {
                const newHeight = level > 0 ? maxHeight * (level / maxLevelValue) : 0;
                const levelPosition = { x: tank.waterLevel.x(), y: maxHeight - newHeight + knobMargin };
    
                tank.waterLevel.absolutePosition(levelPosition);
                tank.knob.absolutePosition(levelPosition);
                tank.waterLevel.size({ width: maxWidth, height: newHeight});
    
                console.log(newHeight);
                console.log(levelPosition);
            }
    
            tank.knob.on("dragmove", (e) => {
                const knobRect = tank.knob.getClientRect();
                const tick = tank.ticks.find(t => rectsIntersect(t.getClientRect(), knobRect));
                if (tick) {
                    setTankLevel(tick.name());
                }
            });
    
            setTankLevel(config.value);
        });
    }

    const demos = {
        add: addInput
    };

    window.demos = demos;
})();