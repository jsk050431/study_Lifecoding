let body = {
    setColor : function(color) {
        document.querySelector("body").style.color = color;
    },
    setBackgroundColor : function(color) {
        document.querySelector("body").style.backgroundColor = color;
    }
}
let link = {
    setColor : function(color) {
        document.querySelectorAll("a").forEach(link => {
            link.style.color = color;
        })      
    },
    setHomeColor : function(color) {
        document.querySelector("#home").style.color = color;
    }
}
function setDisplayMode(setMode) {
    if(setMode === "Night") {
        localStorage.setItem("mode", "Night");
        body.setColor("white");
        body.setBackgroundColor("black");
        link.setColor("skyblue");
        link.setHomeColor("gray");
    } else if(setMode === "Day") {
        localStorage.setItem("mode", "Day");
        body.setColor("black");
        body.setBackgroundColor("white");
        link.setColor("blue");
        link.setHomeColor("gray");
    } else {
        alert("Unexpected Error");
    }
}
function nightDayHandler(self) {
    if(self.value === "Night") {
        setDisplayMode("Night")
        self.value = "Day";
    } else if(self.value === "Day") {
        setDisplayMode("Day")
        self.value = "Night";
    } else {
        alert("Unexpected Error");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("mode");
    const button = document.querySelector("#button");
    if (savedMode === "Night") {
        setDisplayMode("Night")
        button.value = "Day"
    } else if (savedMode === "Day") {
        setDisplayMode("Day")
        button.value = "Night"
    } else {
        alert("Unexpected Error");
    }
})