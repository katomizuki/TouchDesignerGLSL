const float PI = 3.141592;
uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;

float rectSDF(vec2 p, vec2 c, vec2 d) {
	p = abs(p - c);
	return length(max(p - d,vec2(0.0))) + min(max(p.x - d.x, p.y - d.y), 0.0);
}

float circleSDF(vec2 p ,vec2 c, float r) {
	return length(p - c) - r;
}

vec3 contour(float v, float interval) {
	return abs(v) < 0.01 ? vec3(0.0) :
	mod(v, interval) < 0.01 ? vec3(1.0) :
	mix(vec3(0,0,1), vec3(1,0,0), atan(v) / PI + 0.5);
}
void main()
{
	vec2 pos = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	float v1 = circleSDF(pos, vec2(0.2), 0.4);
	float v2 = rectSDF(pos, vec2(-0.2), vec2(0.4));
	float v = int(uTime) % 3 == 0 ? max(v1, v2) : max(v1, -v2);
	fragColor = TDOutputSwizzle(vec4(contour(v, 0.1), 1.0));
}
