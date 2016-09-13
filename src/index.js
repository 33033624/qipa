
var module =(function(){
    var arr = [],ols, posT, posL,uls = document.querySelectorAll('ul'), sec = document.querySelector('section'), undo=document.querySelector('.undo'), isCol=false,lis= [],secT=parseFloat(window.getComputedStyle(sec,null)['marginTop']),secL=sec.offsetLeft, white=[],black=[],isUndo=null,oSpan=sec.querySelectorAll('span'),clearGame = document.querySelector('.clearGame');

    /*
     * 实现点击 创建span标签  并且将对应的位置信息以及颜色填入到数组中
     *
     * */

    function clickPosCol(){
        /*实现所有位置的添加*/
        for (var i = 0; i < uls.length; i++) {
            ols = uls[i].querySelectorAll('li');
            for (var j = 0; j < ols.length; j++) {
                lis.push(lis[j]);
                var pos = {};
                pos.l = ols[j].offsetLeft;
                pos.t = ols[j].offsetTop;
                arr.push(pos);
                if(i==uls.length-1){
                    arr.push({l:ols[j].offsetLeft,t:sec.offsetHeight});
                    if(j==ols.length-1){
                        arr.push({l:sec.offsetWidth,t:sec.offsetHeight});
                    }
                }
            }
            arr.push({l:uls[i].offsetWidth,t:uls[i].offsetHeight*i})
        }


        /*
         * 事件委托寻找到点击事件时候的最近的点
         * */
        sec.onclick=function(e){
            var curPos= {x:e.pageX-secL,y: e.pageY-secT}, min = 0, that= this;
            arr.forEach(function(item,index){
                if((Math.pow((curPos.x-item['l']),2)+Math.pow((curPos.y-item['t']),2))<(Math.pow(curPos.x-arr[min]['l'],2)+Math.pow(curPos.y-arr[min]['t'],2))){
                    min =index;
                }
            });

            /*
             * 不能实现重复添加功能
             * */
            if(!arr[min].isLive){
                isCol=!isCol;
                var span = document.createElement('span');
                span.className=isCol==true?'black':'white';
                sec.appendChild(span);
                span.posEle=min;
                var L=arr[min].l-10,T=arr[min].t-10;
                isUndo=isCol==true?'Black':'White';
                isCol==true?black.push({
                    left:L,
                    top:T,
                    ele:span
                }):white.push({
                    left:L,
                    top:T,
                    ele:span
                });

                var judgeArr=isUndo=='Black'?black.slice(0):white.slice(0);
                span.style.left=L+'px';
                span.style.top=T+'px';
                span.x=L;
                span.y=T;
                arr[min].isLive=true;
                Undo(span);
                if(judge(span,judgeArr)){

                    alert(isUndo+'赢了');
                    /*
                     * 下面是清除绑定的方法  但是未优化
                     * */
                    oSpan=document.querySelectorAll('span');
                    arr = [];
                    isCol=false;
                    lis= [];
                    white=[];
                    black=[];
                    isUndo=null;
                    for(var i=0;i<oSpan.length;i++){
                        sec.removeChild(oSpan[i]);
                    }
                    clickPosCol();
                }
            }
        };
    }
    /*
     * 实现悔棋功能
     *
     * */

    function Undo(ele){
        undo.onclick=function(){
            if(isUndo){
                if(isUndo=='Black'){
                    sec.removeChild(black[black.length-1].ele);
                    black.pop();
                }else{
                    sec.removeChild(white[white.length-1].ele);
                    white.pop();
                }
                arr[ele.posEle].isLive=false;
                isCol=!isCol;
                isUndo=null;
            }
        }
    }

    /*
     * 重玩
     *
     * */
    function clear(){
        clearGame.onclick=function(){
            oSpan=document.querySelectorAll('span');
            arr = [];
            isCol=false;
            lis= [];
            white=[];
            black=[];
            isUndo=null;
            for(var i=0;i<oSpan.length;i++){
                sec.removeChild(oSpan[i]);
            }
            clickPosCol();
        }
    }

    /*
     * 判断输赢
     *
     *
     * */

    function judge(span,judgeArr){
        return  judegeX(span,judgeArr)
    }

    /*
     * 实现判断x成立的时候执行
     * */
    function judegeX(span,judgeArr){
        var y=[];
        judgeArr.forEach(function(item,index){
            if(item.top==span.y){
                y.push(item);
                if(item.left!=span.x){
                    judgeArr[index]=null;
                }
            }
        });
        y.sort(function(a,b){
            return a.left- b.left;
        });

        var isLevel ;

        y.forEach(function(item,index){
            var arr =[];
            arr=y.slice(index,index+5);
            if(arr[index+4]){
                if(arr[index+4].left==(item.left+200)){
                    return isLevel = true;
                }
                isLevel=false;
            }
        });
        if(!isLevel){
            return  judegeY(span,judgeArr);
        }else{

            return true;
        }
    }


    /*
     * 实现Y成立时候执行
     *
     * */
    function judegeY(span,judgeArr){
        var x=[];
        for(var i=0;i<judgeArr.length;i++){
            if(judgeArr[i]==null){
                judgeArr.splice(i,1);
                i--;
            }
        }
        judgeArr.forEach(function(item,index){
            if(item.left==span.x){
                x.push(item);
                if(item.top!=span.y){
                    judgeArr[index]=null;
                }
            }
        });
        x.sort(function(a,b){
            return a.top- b.top;
        });
        var isVertical ;
        x.forEach(function(item,index){
            var arr =[];
            arr=x.slice(index,index+5);
            if(arr[index+4]) {
                if (arr[index + 4].top == item.top + 200) {
                    return isVertical = true;
                }
                isVertical = false;
            }
        });
        if(!isVertical){
            return  judegeSlash(span,judgeArr) ;
        }else{
            return true;
        }
    }
    function judegeSlash(span,judgeArr){
        for(var i=0;i<judgeArr.length;i++){
            if(judgeArr[i]==null){
                judgeArr.splice(i,1);
                i--;
            }
        }
        var leftY=[],rightY=[];
        judgeArr.forEach(function(item,index){
            if((item.left>=span.x&&item.top>=span.y)||(span.x>=item.left&&span.y>=item.top)){
                if(Math.abs(item.left-span.x)==Math.abs(item.top-span.y)){
                    rightY.push(item);
                }
            }else{
                if(Math.abs(item.left-span.x)==Math.abs(item.top-span.y)){
                    leftY.push(item);
                }
            }
        });
        rightY.sort(function(a,b){
            return a.left- b.left;
        });
        leftY.sort(function(a,b){
            return a.left- b.left;
        });
        var isOverR=false,isOverL=false;


        /*
         实现右上斜线执行
         * */
        rightY.forEach(function(item1,index){
            var arr=rightY.slice(index,index+5);
            arr.forEach(function(item2,index2){
                if(arr[index2+4]){
                    if(arr[index2+4].top==(item2.top+200)&&(arr[index2+4].left==(item2.left+200))){
                        return isOverR=true;
                    }
                }

            });
            if (isOverR==true)return isOverR = true;

        });


        /*
         * 实现左上斜线成立执行
         * */
        leftY.forEach(function(item1,index){
            var arr=leftY.slice(index,index+5);
            arr.forEach(function(item2,index2){
                if(arr[index2+4]) {
                    if ((arr[index2 + 4].left == (item2.left + 200))&&(arr[index2 + 4].top == (item2.top + 200))) {
                        return isOverL = true;
                    }
                }
            });
            if (isOverL==true)return isOverL = true;


        });

        if(isOverL||isOverR) return true;
    }
    function init(){
        clear();
        clickPosCol();
    }
    return init;

}());
module();



