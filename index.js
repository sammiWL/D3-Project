console.log("HELLO");

var datacounter = 0;
var info = data[0].split("\n");
var b = d3.select("#bill").text(name_data[0]);
var intervalId;
var degrees = 180 / Math.PI;

var viewNext = function viewNext(){
    
    if (datacounter != 4){
	datacounter += 1;
    } else {
	datacounter = 0;
    }
    
    var bill = data[datacounter];
    d3.select("#bill").text(name_data[datacounter]);
    info = data[datacounter].split("\n");

    spermSetup();
    // console.log(data[datacounter]);
    console.log(name_data[datacounter]);
    console.log(info);
}
var button = document.getElementById("next").addEventListener("click",viewNext);

//console.log(info);

var spermSetup = function spermSetup(e) {
    document.getElementById("house").innerHTML = "";
    clearInterval(intervalId);
    
    var counter = 0;
    while (counter != info.length){
	info[counter] = info[counter].split(",");
	counter ++;
    }
    //console.log(info);
    var width = window.innerWidth,
	height = window.innerHeight / 1.7;

    var n = info.length;
    var m = 10;
   

    counter = -1;
    var spermatozoa = d3.range(n).map(function() {
	counter++;
	console.log(counter);
	var x = Math.random() * (width -200) + 100,
	    y = Math.random() * (height -200) + 100;
	return {
	    vx: (((width  )/2 - x) *( 1 + .05 * Math.random())) / 500,
	    vy: (((height - 100) - y) *(1 + .5 * Math.random())) / 500,
	    vy: (((100) - y) *(1 + .5 * Math.random())) / 500,
	    views: null,
	    path: d3.range(m).map(function() { return [x, y]; }),
	    count: 0,
	    id: info[counter][0],
	    state: info[counter][1],
	    district: info[counter][2],
	    vote: info[counter][3],
	    name: info[counter][4],
	    party: info[counter][5]
	};
    });

    //console.log(spermatozoa);
    counter = 0;
    while (counter != n){
	console.log("HELLO");
	//console.log(info[counter][3]);
	sperm = spermatozoa[counter];
	//sperm.info = info[counter]
	y = sperm.path[0][1];
	x = sperm.path[0][1];
	if (sperm.vote == "Nay")
	    sperm.vy = (((height - 100) - y) *(1 + .5 * Math.random())) / 500;
	else if (sperm.vote == "Yea")
    	    sperm.vy = (((100) - y) *(1 + .5 * Math.random())) / 500;
	else{
    	    sperm.vy = (((height )/2 - y) *( 1 + .05 * Math.random())) / 500;
	    sperm.vx += 1;}
	counter +=1;
    }


    var svg = d3.select("#house").append("svg")
	.attr("width", width)
	.attr("height", height);

    svg.append("ellipse").attr("rx", 50).attr("ry", 30).attr("cx", width /2).attr("cy", 80).attr("style","fill: #FFFFFF;");
    svg.append("ellipse").attr("rx", 50).attr("ry", 30).attr("cx", width /2).attr("cy", height - 80).attr("style","fill: #FFFFFF;");

    counter = 0;

    var g = svg.selectAll("g")
	.data(spermatozoa)
	.enter().append("g");

    console.log(g);

    var head = g.append("ellipse")
    //.attr("style", "fill: #00bfff;")
	.attr("style",function(d){
	    if (d.party == "Republican") return "fill:#FF0000" ;
	    else if (d.party == "Democrat") return "fill:#00bfff";
	    else return "fill: green"
	})
	.attr("rx", 6.5)
	.attr("ry", 4);

    g.append("path")
	.datum(function(d) { return d.path.slice(0, 3); })
	.attr("class", "mid");

    g.append("path")
	.datum(function(d) { return d.path; })
	.attr("class", "tail");

    var tail = g.selectAll("path");

    var spermMovement = function spermMovement() {
    //d3.timer(function() {
	for (var i = -1; ++i < n;) {
	    var spermatozoon = spermatozoa[i],
		path = spermatozoon.path,
		dx = spermatozoon.vx,
		dy = spermatozoon.vy,
		x = path[0][0] += dx,
		y = path[0][1] += dy,
		//speed = Math.sqrt(dx * dx + dy * dy),
		speed = 1,
		count = speed * 10,
		k1 = -5 - speed / 3;

	    // Bounce off the walls.
	    //if (x < 100 || x > width-100) spermatozoon.vx *= -1;
	    //if (y < 100 || y > height-100) spermatozoon.vy *= -1;

	    //stop at the walls.
	    if (((x < 100 || x > width -100) && (spermatozoon.vx < -.0000001|| spermatozoon.vx > .0000001)) || ((y < 100 || y > height -100) && (spermatozoon.vy < -.0000001 || spermatozoon.vy > .0000001)))
	    {
		if (spermatozoon.vote == "Not Voting")
		{ spermatozoon.vx *= -1; spermatozoon.vy *= -1;}
		else{
 		    spermatozoon.vx *= 0.97; 
		    spermatozoon.vy *= 0.97;}}
	    

	    // Swim!
	    for (var j = 0; ++j < m;) {
		var vx = x - path[j][0],
		    vy = y - path[j][1],
		    k2 = Math.sin(((spermatozoon.count += count) + j * 3) / 300) / speed;
		path[j][0] = (x += dx / speed * k1) - dy * k2;
		path[j][1] = (y += dy / speed * k1) + dx * k2;
		speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
	    }
	}

	head.attr("transform", headTransform);
	tail.attr("d", tailPath);
    };
    
    intervalId = window.setInterval(spermMovement, 16);

}

var headTransform = function headTransform(d) {
	return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
}

var tailPath = function tailPath(d) {
    return "M" + d.join("L");
}

var button = document.getElementById("next");
button.addEventListener("click",viewNext);
viewNext();
