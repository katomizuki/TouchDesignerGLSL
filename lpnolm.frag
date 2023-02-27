out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;
#include "util"

float kyoto(vec3 p) {
	return abs(p.x) + abs(p.y) + abs(p.z);
}

float shogi(vec3 p) {
	return max(max(abs(p.x), abs(p.y)), abs(p.z));
}

float euc(vec3 p) {
	return length(p);
}

float length_(vec3 p){
    float time = uTime * 0.2;
    float v0, v1;
    if (int(time) % 3 == 0){
        v0 = euc(p);
        v1 = shogi(p);
    } else if (int(time) % 3 == 1){
        v0 = shogi(p);
        v1 = kyoto(p);
    } else {
        v0 = kyoto(p);
        v1 = euc(p);
    }
    return mix(v0, v1, smoothstep(0.25, 0.75, fract(time)));
}

float length2(vec3 p){
    p = abs(p);
    float d = 4.0 * sin(0.5 * uTime) + 5.0;
    return pow(pow(p.x, d) + pow(p.y, d) + pow(p.z, d), 1.0 / d);
} 

float sphereSDF(vec3 p){
    return length2(p) - 0.5;
}

float sceneSDF(vec3 p){
    return sphereSDF(p);
}

vec3 gradSDF(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        sceneSDF(p + vec3(d, 0.0, 0.0)) - sceneSDF(p - vec3(d, 0.0, 0.0)),
        sceneSDF(p + vec3(0.0, d, 0.0)) - sceneSDF(p - vec3(0.0, d, 0.0)),
        sceneSDF(p + vec3(0.0, 0.0, d)) - sceneSDF(p - vec3(0.0, 0.0, d))
    ));
}


void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 t = vec3(0.3 * uTime);
	vec3 cPos = euler(vec3(0, 0, 2.0), t);
	vec3 cDir = euler(vec3(0, 0, -1.0), t);
	vec3 cUp = euler(vec3(0, 1, 0), t);
	vec3 cSide = cross(cDir, cUp);
	
	float targetDepth = 1.0;

	vec3 ray = p.x * cSide + p.y * cUp + targetDepth * cDir;
	vec3 rPos = ray + cPos;
	ray = ray / length2(ray);

	vec3 lDir = euler(vec3(0,0,1), t);
	 fragColor.rgb = vec3(0.0);
    for(int i = 0; i < 50; i ++ ){
        if (sceneSDF(rPos) > 0.001){
            rPos += sceneSDF(rPos) * ray;
        } else {
            float amb = 0.1;
            float diff = 0.9 * max(dot(normalize(lDir), gradSDF(rPos)), 0.0);
            vec3 col = vec3(0.0, 1.0, 1.0);
            fragColor.rgb = col * (diff + amb);
            break;
        }
    }
    fragColor.a = 1.0;
}
