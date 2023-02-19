uniform vec2 uMouse;
uniform vec2 uResolution;
const float PI = 3.141592;

out vec4 fragColor;
float circle(vec2 pos, vec2 center, float radius) {
	float dist = 0.5 + uMouse.x / uResolution.x;
	//同じベクトルどうしの内積はベクトルの大きさの二乗と同じ値二になる。　dist.が大きければ大きいほど値は大きくなり　小さければ小さいほど小さくなる。ここから半径をひくことで
	// これがマイナスだと円内 
	return pow(dot(pos - center, pos - center), 0.5) - radius;
}

vec3 contour(float v, float interval) {
	return abs(v) < 0.01 ? vec3(0.0) : mod(v, interval) < 0.01 ? vec3(1.0) : mix(vec3(0,0,1), vec3(1,0,0), atan(v) / PI + 0.5);
}
void main()
{
	vec2 pos = (2.0 * gl_FragCoord.xy - uResolution.xy) / min(uResolution.x , uResolution.y);
	fragColor = TDOutputSwizzle(vec4(vec3(contour(circle(pos, vec2(0.0), 1.0), 0.3)),1));
}
