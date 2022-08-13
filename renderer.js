/**
 * The Renderer
 */
 class Renderer{

    constructor(canvas){
        this.H = canvas.height
        this.W = canvas.width
        this.ctx = canvas.getContext("2d")
    }

    queueAction(action,layer,kwargs){
        if (layer in RenderQueue){
            RenderQueue[layer].push(action(...kwargs))
        }else{
            RenderQueue[layer] = [action(...kwargs)]
        }
    }

    newFrame(){
        function* newFrameCoroutine(self){
            self.ctx.fillStyle = "#000000";
            self.ctx.fillRect(0, 0, W, H);
        }

        this.queueAction(newFrameCoroutine,0,[this])
    }

    /**
     * 
     * @param {Number} radius
     * @param {String} color 
     */
    drawCircle(pos,radius,color)
    {
        function* drawCircleCoroutine(self,pos,radius,color){

            const ctx = self.ctx
            ctx.fillStyle = color;
    
            ctx.beginPath();
            ctx.arc(pos.x,pos.y,radius,0,2* Math.PI);
            ctx.fill();
    
            // WRAPAROUND RENDERING
            let newX = pos.x;
            let newY = pos.y;
            let wraparound = false;

            // check x bounds
            if (pos.x + radius > W){
                newX = pos.x - W
                wraparound = true
            }
            else if (pos.x - radius < 0){
                newX = pos.x + W
                wraparound = true
            }

            // check y bounds
            if (pos.y + radius > H){
                newY = pos.y - H
                wraparound = true
            }
            else if (pos.y - radius < 0){
                newY = pos.y + H
                wraparound = true
            }

            if (wraparound){
                ctx.beginPath();
                ctx.arc(newX,newY,radius,0,2* Math.PI);
                ctx.fill();
            }
        }

        this.queueAction(drawCircleCoroutine,3,[this,pos,radius,color])
    }

    drawExhaust(position,rotation,scale){

        function* drawExhaustCoroutine(self,position,rotation,scale){ 
            const ctx = self.ctx
            ctx.fillStyle = "#FFFFFF";
            ctx.save()
            ctx.translate(position.x,position.y)
            ctx.rotate(rotation*Math.PI/180)
            ctx.beginPath()
            ctx.moveTo(-5*scale,10)
            ctx.lineTo(0,10 + (15*scale))
            ctx.lineTo(5*scale,10)
            ctx.fill()
            ctx.restore()
        }

        this.queueAction(drawExhaustCoroutine,2,[this,position,rotation,scale])
    }
}