const float PI = 3.141592;
uniform vec2 uResolution;
out vec4 fragColor;
float rectSDF(vec2 pos, vec2 center, vec2 d) {
	pos = abs(pos - center);
	return length(max(pos - d, vec2(0,0))) + min(max(pos.x - d.x, pos.y - d.y), 0.0);
}

vec3 contour(float v, float interval){
    return abs(v) < 0.01 ? vec3(0.0):
    mod(v, interval) < 0.01 ? vec3(1.0):
    mix(vec3(0, 0, 1), vec3(1, 0, 0), atan(v) / PI + 0.5);
}

void main()
{
	vec2 pos = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	fragColor = TDOutputSwizzle(vec4(vec3(contour(rectSDF(pos,vec2(0.0), vec2(0.5)), 0.1)),1));
}
