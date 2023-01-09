#include "pixel2D"
uniform vec2 uResolution;
out vec4 fragColor;
// vec2 tiling(float n, vec2 p) {
// 	return vec2(fract(p * n));
// }

// float circle(float radius, vec2 p, float size) {
// 	float d = length(p);
// 	d *= size;
// 	return smoothstep(radius, 1.0, d);
// }
void main()
{
vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
vec2 center = vec2(0.5,0.5);
vec4 color = vec4(0.0,0,0,1.0);
p = tiling(2, p);
p -= center;
// 各格子の原点をずらす
float circle = circle(0.8, p, 2);
color.rgb = vec3(circle);
// color.rgb = vec3(p, 0);
fragColor = TDOutputSwizzle(color);	
}


