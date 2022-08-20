/**
 * The Renderer Object is a single global renderer that creates coroutines and sends them off
 * to the RenderQueue object. Each coroutine contains instructions for how to draw shapes in Canvas2D.
 * The RenderQueue is structured like:
 * { 0 : [newFrameCoroutine], 1 : [drawCircleCoroutine,...], ...}
 * This is done so that render calls can be deferred until later, and can be executed in layers with some sort of Z ordering
 */
 class Renderer{

    H : number
    W : number
    ctx : CanvasRenderingContext2D

    constructor(canvas : HTMLCanvasElement){
        this.H = canvas.height
        this.W = canvas.width
        this.ctx = canvas.getContext("2d") ?? new CanvasRenderingContext2D()
    }

    /**
     * 
     * @param {Function} action The Function to be queued
     * @param {number} layer Layer at which to render. Zero goes first, then higher numbers
     * @param {Array} kwargs List of arguments to be spread into individual args. Always contains at least "this"
     */
    queueAction(action : Function, layer : number, kwargs : Array<any>){
        if (layer in RenderQueue){
            RenderQueue[layer].push(action(...kwargs))
        }else{
            RenderQueue[layer] = [action(...kwargs)]
        }
    }

    // Draws a big black square over the background
    newFrame(){
        function* newFrameCoroutine(self : Renderer){
            self.ctx.fillStyle = "#000000";
            self.ctx.fillRect(0, 0, W, H);
        }

        this.queueAction(newFrameCoroutine,0,[this])
    }

    drawText(text : string,position : Vector2D,size : number, color : string){
        function* drawTextCoroutine(self : Renderer,text : string,position : Vector2D,size : number,color : string){
            const ctx = self.ctx
            ctx.fillStyle = color;
            ctx.font = size + 'px sans-serif'
            ctx.fillText(text,position.x,position.y)
        }

        this.queueAction(drawTextCoroutine,5,[this,text,position,size,color])
    }

    drawLine(start : Vector2D,end : Vector2D,color : string){

        function* drawLineCoroutine(self : Renderer,start : Vector2D,end : Vector2D,color : string){
            const ctx = self.ctx
            ctx.strokeStyle = color
            ctx.beginPath()
            ctx.moveTo(start.x,start.y)
            ctx.lineTo(end.x,end.y)
            ctx.stroke()
        }

        this.queueAction(drawLineCoroutine,5,[this,start,end,color])
    }

    drawCircle(pos : Vector2D,radius : number,color : string)
    {
        function* drawCircleCoroutine(self : Renderer,pos : Vector2D,radius : number,color : string){

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

    drawExhaust(position : Vector2D,rotation : number,scale : number){

        function* drawExhaustCoroutine(self : Renderer,position : Vector2D,rotation : number,scale : number){ 
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