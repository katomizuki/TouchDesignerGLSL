uniform float uTime;
uniform vec2 uResolution;
const float PI = 3.141592;
out vec4 fragColor;

float length2(vec2 p) {
	float t = mod(uTime,3.0);
	p = abs(p);
	if(t < 1.0) {
		return length(p);
	} else if (t < 2.0) {
		return dot(p, vec2(1.0));
	} else {
		return max(p.x, p.y);
	}
}

float circle(vec2 p, vec2 c, float r) {
	return length2(p - c) - r;
}

void main()
{
	vec2 pos = (gl_FragCoord.xy * 2 - uResolution.xy) / uResolution.yy;
	float w = circle(pos, vec2(0.0), 0.8);
	vec3 v = vec3(step(mod(w, 0.1), 0.01));
	v += mix(vec3(0,0,1), vec3(1,0,0), atan(w) / PI + 0.5);
	v += 1.0 - step(abs(w), 0.01);
	fragColor = TDOutputSwizzle(vec4(vec3(v), 1));
}
