window.onload = function () {

    var list = document.getElementById("list");
    var boxs = list.children;
    var timer;

    // 删除节点
    function removeNode(node) {
        node.parentNode.removeChild(node);
    }

    // 赞分享
    function pariseBox (box, el) {
        var pariseElement = box.getElementsByClassName("praises-total")[0];
        var oldTotla = parseInt(pariseElement.getAttribute("total"));
        var txt = el.innerHTML;
        var newTotal;
        if (txt == "赞") {
            newTotal = oldTotla + 1;
            pariseElement.innerHTML = (newTotal == 1) ? "我觉得很赞" : "我和" + oldTotla + "个人觉得很赞"
            el.innerHTML = "取消赞"
        } else {
            newTotal = oldTotla - 1;
            pariseElement.innerHTML = (newTotal == 0) ? "" : newTotal + "个人觉得很赞"
            el.innerHTML = "赞"
        }
        pariseElement.setAttribute("total", newTotal);
        pariseElement.style.display = (newTotal == 0) ? "none" : "block"
    }

    // 格式化时间
    function getTime() {
        var time = new Date();
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDay();
        var h = time.getHours();
        var mi = time.getMinutes();
        m = m < 10 ? "0" + m : m
        d = d < 10 ? "0" + d : d
        h = h < 10 ? "0" + h : h
        mi = mi < 10 ? "0" + mi : mi
        return y + "-" + m + "-" + d + " " + h + ":" + mi; 
    }

    // 发表评论
    function replayBox (box) {
        var list = box.getElementsByClassName('comment-list')[0];
        var textarea = box.getElementsByClassName('comment')[0];
        var li = document.createElement('div');
        li.className = 'comment-box clearfix';
        li.setAttribute('user', 'self');
        li.innerHTML =
            '<img class="myhead" src="images/my.jpg" alt=""/>' +
                '<div class="comment-content">' +
                '<p class="comment-text"><span class="user">我：</span>' + textarea.value + '</p>' +
                '<p class="comment-time">' +
                getTime() +
                '<a href="javascript:;" class="comment-praise" total="0" my="0" style="">赞</a>' +
                '<a href="javascript:;" class="comment-operate">删除</a>' +
                '</p>' +
                '</div>'
        list.appendChild(li);
        textarea.value = '';
        textarea.onblur();
    }
    
    // 赞回复
    function praiseReply (el) {
        var myPraise = parseInt(el.getAttribute("my"));
        var oldTotal = parseInt(el.getAttribute("total"));
        var newTotal;
        if (myPraise == 0) {
            newTotal = oldTotal + 1;
            el.setAttribute("total", newTotal);
            el.setAttribute("my", 1);
            el.innerHTML = newTotal + " 取消赞";
        }
        else {
            newTotal = oldTotal - 1;
            el.setAttribute("total", newTotal);
            el.setAttribute("my", 0);
            el.innerHTML = (newTotal == 0) ? "赞" : newTotal + " 赞";
        }
        el.style.display = (newTotal == 0) ? "" : "inline-block"
    }

    // 操作回复
    function operateReply (el) {
        var commentBox = el.parentNode.parentNode.parentNode;
        var box = commentBox.parentNode.parentNode.parentNode;
        var txt = el.innerHTML;
        var user = commentBox.getElementsByClassName('user')[0].innerHTML;
        var textarea = box.getElementsByClassName('comment')[0];
        if (txt == "回复") {
            textarea.onfocus();
            textarea.focus();
            textarea.value = "回复" + user;
            textarea.onkeyup();
        } else {
            removeNode(commentBox);
        }
    }
    

    // 把事件代理到每条分享div容器
    for (var i = 0; i < boxs.length; i++) {

        // 点击
        boxs[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            switch (el.className) {

                // 关闭分享
                case "close":
                    removeNode(el.parentNode);
                    break;
                
                // 赞分享
                case "praise":
                    pariseBox(el.parentNode.parentNode.parentNode, el);
                    break;
                
                // 回复按钮灰色的时候
                case "btn btn-off": 
                    clearInterval(timer);
                    break;

                // 回复
                case "btn":
                    replayBox(el.parentNode.parentNode.parentNode);
                    break;

                // 赞回复
                case "comment-praise":
                    praiseReply(el);
                    break;
                
                // 操作回复
                 case "comment-operate":
                    operateReply(el);
                    break;
            }
        }

        // 输入框
        var textarea = boxs[i].getElementsByClassName("comment")[0];

        textarea.onfocus = function () {
            this.parentNode.className = "text-box text-box-on";
            this.value = this.value == "评论…" ? "" : this.value
            this.onkeyup();
        }

        textarea.onblur = function () {
            var _this = this;
            if (_this.value == "") {
                timer = setTimeout(function () {
                    _this.parentNode.className = "text-box";
                    _this.value = "评论…";
                }, 300)

            }
        }

        textarea.onkeyup = function (e) {
            var len = this.value.length;
            var p = this.parentNode;
            var btn = p.children[1];
            var word = p.children[2];
            if (len == 0 || len > 140) {
                btn.className = "btn btn-off"
            } else {
                btn.className = "btn";
            }
            word.innerHTML = len + "/140"
        }

    }
}