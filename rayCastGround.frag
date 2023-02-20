uniform float uTime;
uniform vec2 uResolution;

out vec4 fragColor;
void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	// Camera　info
	vec3 cPos = vec3(0,0,0);
	vec3 cDir = vec3(0,0,- 1);
	vec3 cUp = vec3(0,1,0);
	// cross vector 
	vec3 cSide = cross(cDir,cUp);
	float targetDepth = 1.0;
	// Camera-> Screen Ray 
	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth;
	// normal of ground
	vec3 groundNormal = vec3(0,1,0);
	if(dot(ray, groundNormal) < 0.0) {
		fragColor.rgb = vec3(1.0);
	} else {
		fragColor.rgb = vec3(0);
	}
	fragColor.a = 1.0;
}
