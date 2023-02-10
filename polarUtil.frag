const float PI = 3.141592;

float atan2(float y, float x) 
{
	if(x == 0.0) {
		return sign(y) * PI / 2.0;
	} else {
		return atan(y, x);
	}
}

vec2 xy2pol(vec2 xy) {
	return vec2(atan2(xy.y, xy.x), length(xy));
}

vec2 pol2xy(vec2 pol) {
	return pol.y * vec2(cos(pol.x), sin(pol.x));
}
