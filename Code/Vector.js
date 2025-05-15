class vector {
    constructor(x, y) {
        // Positions
        this.x = x;
        this.y = y;
        
        // Visual properties
        this.color = "black";
        this.thickness = 2;
        
        // Calculate initial length
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Draw the vector
    show(cX = 0, cY = 0) {
        let endX = cX + this.x;
        let endY = cY + this.y;
        let angle = Math.atan2(this.y, this.x);  // Corrected to Math.atan2

        // Color and stroke
        stroke(this.color);
        fill(this.color);
        strokeWeight(this.thickness);
        
        line(cX, cY, endX, endY);

        push();
        translate(endX, endY);
        rotate(angle);
        
        triangle(0, 0, -this.thickness * 2, -this.thickness * 2, -this.thickness * 2, this.thickness * 2);
        pop();
    }

    // Getters and setters for positions
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setX(X) {
        this.x = X;
    }
    setY(Y) {
        this.y = Y;
    }
    setCord(X, Y) {
        this.x = X;
        this.y = Y;
    }

    // Magnitude/length
    getMag() {
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
        return this.length;
    }

    setMag(length) {
        this.normalize();
        this.multi(length);
    }

    setLimit(max) {
        if (this.getMag() > max) {
            this.normalize();
            this.multi(max);
        }
    }

    setMinMaxLimit(min,max){
        if (this.getMag() > max) {
            this.normalize();
            this.multi(max);
        }else if (this.getMag() < min){
            this.normalize();
            this.multi(min);
        }
    }

    // Visual attributes
    setThickness(thickness) {
        this.thickness = thickness;
    }

    setColor(color) {
        this.color = color;
    }

    // Operations
    add(vector) {
        this.x += vector.getX();
        this.y += vector.getY();
    }



    sub(vector) {
        this.x -= vector.getX();
        this.y -= vector.getY();
    }


    multi(num) {
        this.x *= num;
        this.y *= num;
    }
    div(num) {
        this.x /= num;
        this.y /= num;
    }

    normalize() {
        let len = Math.sqrt(this.x * this.x + this.y * this.y);  // Calculate the length
        this.x /= len;
        this.y /= len;
    }

    getNormal() {
        let mag = this.getMag();
        if (mag === 0) return new vector(0, 0);
        return new vector(this.x / mag, this.y / mag);
    }
    //rotates the  vector 90 deg
    getNormal2() {
        let mag = this.getMag();
        if (mag === 0) return new vector(0, 0);
        return new vector(-this.y / mag, this.x / mag);
    }

    toString() {
        return this.x + "," + this.y;
    }

    copy() {
        return new vector(this.x, this.y);  // Return a new instance of the vector
    }

    dot(vector) {
        let thisNormal=this.getNormal();
        let otherNormal=vector.getNormal();

        return thisNormal.x*otherNormal.x+thisNormal.y*otherNormal.y;

        //return this.x * vector.x + this.y * vector.y;
    }

    //rotates the fist vector 90 deg
    dot2(vector) {
        let thisNormal=this.getNormal2();

        let otherNormal=vector.getNormal();

        return thisNormal.x*otherNormal.x+thisNormal.y*otherNormal.y;

        //return this.x * vector.x + this.y * vector.y;
    }

    negative() {
        return new vector(-this.x, -this.y);
    }

    // Check if vectors are parallel, opposite, or perpendicular
    isParallel(vector) {
        return Math.round(this.getNormal().dot(vector.getNormal()), 10) === 1;
    }

    isOpposite(vector) {
        return Math.round(this.getNormal().dot(vector.getNormal()), 10) === -1;
    }

    isPerpendicular(vector) {
        return Math.round(this.getNormal().dot(vector.getNormal()), 10) === 0;
    }
}
