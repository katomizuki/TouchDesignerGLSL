uniform float uTime;
uniform vec2 uResolution;
#include "util"

out vec4 fragColor;

float kyoto(vec3 p) {
	return abs(p.x) + abs(p.y) + abs(p.z);
}

float shogi(vec3 p) {
	return max(max(abs(p.x), abs(p.y)), abs(p.z));
}

float euc(vec3 p) {
	return length(p);
}

float length2(vec3 p) {
	float t = uTime * 0.2;
	float[3] v;
	v[0] = euc(p);
	v[1] = shogi(p);
	v[2] = kyoto(p);
	return mix(v[int(t) % 3], v[(int(t) + 1) % 3], smoothstep(0.25, 0.75, fract(t)));
}

float sphereSDF(vec3 p) {
	return length2(p) - 0.5;
}

float sceneSDF(vec3 p) {
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
	vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    vec3 t = vec3(uTime * 0.3);
    vec3 cPos = euler(vec3(0.0, 0.0, 2.0), t);
    vec3 cDir = euler(vec3(0.0, 0.0, - 1.0), t);
    vec3 cUp = euler(vec3(0.0, 1.0, 0.0), t);
    vec3 cSide = cross(cDir, cUp);
    
    float targetDepth = 1.0;
    
    vec3 lDir = euler(vec3(0.0, 0.0, 1.0), t);
    
    vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth;
    vec3 rPos = ray + cPos;
    ray = ray / length2(ray);
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
