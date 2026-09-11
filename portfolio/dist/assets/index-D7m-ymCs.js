import"./variables-DfWgXguz.js";import{D as e,E as t,F as n,G as r,H as i,L as a,N as o,O as s,P as c,R as l,S as u,U as d,W as f,a as p,b as m,c as ee,d as te,f as ne,g as re,h as ie,j as ae,k as oe,l as h,o as g,p as se,q as ce,r as le,s as _,u as ue,x as v,y as de,z as fe}from"./projects_array-ChSxXsWo.js";var y=new h,b=new f,pe=class extends de{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new re([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new re([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new m(t,6,1);return this.setAttribute(`instanceStart`,new v(n,3,0)),this.setAttribute(`instanceEnd`,new v(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new m(t,6,1);return this.setAttribute(`instanceColorStart`,new v(n,3,0)),this.setAttribute(`instanceColorEnd`,new v(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new ce(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new h);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),y.setFromBufferAttribute(t),this.boundingBox.union(y))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fe),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)b.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(b)),b.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(b));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}};_.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new d},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},g.line={uniforms:i.merge([_.common,_.fog,_.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var me=class extends l{constructor(e){super({type:`LineMaterial`,uniforms:i.clone(g.line.uniforms),vertexShader:g.line.vertexShader,fragmentShader:g.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return`WORLD_UNITS`in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return`USE_DASH`in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return`USE_ALPHA_TO_COVERAGE`in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE=``:delete this.defines.USE_ALPHA_TO_COVERAGE)}},x=new r,he=new f,ge=new f,S=new r,C=new r,w=new r,T=new f,E=new e,D=new u,_e=new f,O=new h,k=new fe,A=new r,j,M;function N(e,t,n){return A.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),A.multiplyScalar(1/A.w),A.x=M/n.width,A.y=M/n.height,A.applyMatrix4(e.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}function ve(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){D.start.fromBufferAttribute(i,r),D.end.fromBufferAttribute(a,r),D.applyMatrix4(n);let o=new f,s=new f;j.distanceSqToSegment(D.start,D.end,s,o),s.distanceTo(o)<M*.5&&t.push({point:s,pointOnLine:o,distance:j.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,uv1:null})}}function ye(e,n,r){let i=n.projectionMatrix,a=e.material.resolution,o=e.matrixWorld,s=e.geometry,c=s.attributes.instanceStart,l=s.attributes.instanceEnd,u=Math.min(s.instanceCount,c.count),d=-n.near;j.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(i),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,T.copy(w),E.multiplyMatrices(n.matrixWorldInverse,o);for(let n=0,s=u;n<s;n++){if(S.fromBufferAttribute(c,n),C.fromBufferAttribute(l,n),S.w=1,C.w=1,S.applyMatrix4(E),C.applyMatrix4(E),S.z>d&&C.z>d)continue;if(S.z>d){let e=S.z-C.z,t=(S.z-d)/e;S.lerp(C,t)}else if(C.z>d){let e=C.z-S.z,t=(C.z-d)/e;C.lerp(S,t)}S.applyMatrix4(i),C.applyMatrix4(i),S.multiplyScalar(1/S.w),C.multiplyScalar(1/C.w),S.x*=a.x/2,S.y*=a.y/2,C.x*=a.x/2,C.y*=a.y/2,D.start.copy(S),D.start.z=0,D.end.copy(C),D.end.z=0;let s=D.closestPointToPointParameter(T,!0);D.at(s,_e);let u=t.lerp(S.z,C.z,s),p=u>=-1&&u<=1,m=T.distanceTo(_e)<M*.5;if(p&&m){D.start.fromBufferAttribute(c,n),D.end.fromBufferAttribute(l,n),D.start.applyMatrix4(o),D.end.applyMatrix4(o);let t=new f,i=new f;j.distanceSqToSegment(D.start,D.end,i,t),r.push({point:i,pointOnLine:t,distance:j.origin.distanceTo(i),object:e,face:null,faceIndex:n,uv:null,uv1:null})}}}var be=class extends s{constructor(e=new pe,t=new me({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)he.fromBufferAttribute(t,e),ge.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+he.distanceTo(ge);let i=new m(r,2,1);return e.setAttribute(`instanceDistanceStart`,new v(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new v(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;if(r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;j=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;M=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),k.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?M*.5:N(r,Math.max(r.near,k.distanceToPoint(j.origin)),s.resolution),k.radius+=c,j.intersectsSphere(k)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),O.copy(o.boundingBox).applyMatrix4(a);let l;l=n?M*.5:N(r,Math.max(r.near,O.distanceToPoint(j.origin)),s.resolution),O.expandByScalar(l),j.intersectsBox(O)!==!1&&(n?ve(this,t):ye(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(x),this.material.uniforms.resolution.value.set(x.z,x.w))}};le();var xe=document.getElementById(`stars-container`),P=new a,F=new ae(75,window.innerWidth/window.innerHeight,.1,1e3);F.position.z=5;var I=new ee({alpha:!0});I.setSize(window.innerWidth,window.innerHeight),xe.appendChild(I.domElement);function Se(){let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(0,0,0,1)`),n.addColorStop(.3,`rgba(0,0,0,0.5)`),n.addColorStop(1,`rgba(0,0,0,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),new se(e)}var L=new ne,Ce=5e3,we=new Float32Array(Ce*3);for(let e=0;e<Ce*3;e++)we[e]=(Math.random()-.5)*200;L.setAttribute(`position`,new te(we,3));var Te=new c({color:0,size:.3,sizeAttenuation:!0,transparent:!0,map:Se(),depthWrite:!1,depthTest:!0}),R=new o(L,Te);P.add(R);var Ee=0,De=0;window.addEventListener(`mousemove`,e=>{Ee=(e.clientX/window.innerWidth-.5)*2,De=(e.clientY/window.innerHeight-.5)*2});function Oe(){requestAnimationFrame(Oe),R.rotation.y+=(Ee*.3-R.rotation.y)*.05,R.rotation.x+=(De*.3-R.rotation.x)*.05,I.render(P,F)}Oe(),window.addEventListener(`resize`,()=>{F.aspect=window.innerWidth/window.innerHeight,F.updateProjectionMatrix(),I.setSize(window.innerWidth,window.innerHeight)});var z=document.getElementById(`cube-container`),ke=new a,B=new ae(75,z.clientWidth/z.clientHeight,.1,1e3);B.position.z=10;var V=new ee({alpha:!0,antialias:!0});V.setSize(z.clientWidth,z.clientHeight),z.appendChild(V.domElement);var Ae=new ue(7,7,7),je=new ie(Ae),Me=new pe().fromEdgesGeometry(je),H=1.5,Ne=3.5,Pe=H,U=new me({color:0,linewidth:H});U.resolution.set(z.clientWidth||window.innerWidth,z.clientHeight||window.innerHeight);var W=new be(Me,U);ke.add(W);var Fe=.25,G=new oe({color:13219568,transparent:!0,opacity:0,side:2,depthWrite:!0}),Ie=new s(Ae,G);W.add(Ie);var Le=new s(new ue(8,8,8),new oe({transparent:!0,opacity:0,depthWrite:!1,side:2}));W.add(Le);var Re=new n,K=new d(-1e3,-1e3),q=!1,J=!1;z.addEventListener(`pointermove`,e=>{let t=V.domElement.getBoundingClientRect();K.x=(e.clientX-t.left)/t.width*2-1,K.y=-((e.clientY-t.top)/t.height)*2+1,q=!0}),z.addEventListener(`pointerleave`,()=>{q=!1,K.x=-1e3,K.y=-1e3,J=!1});var Y=!1,X=0,Z=0,Q=0;z.style.cursor=`grab`,z.addEventListener(`mousedown`,e=>{Y=!0,X=e.clientX,Z=e.clientY,z.style.cursor=`grabbing`,Q=Fe}),window.addEventListener(`mousemove`,e=>{if(!Y)return;let t=e.clientX-X,n=e.clientY-Z;W.rotation.y+=t*.01,W.rotation.x+=n*.01,X=e.clientX,Z=e.clientY}),window.addEventListener(`mouseup`,()=>{Y&&(Y=!1,z.style.cursor=`grab`,Q=0)});function ze(){requestAnimationFrame(ze),Y||(W.rotation.y+=.003,W.rotation.x+=.0015),q?(Re.setFromCamera(K,B),J=Re.intersectObject(Le).length>0):J=!1,Pe=J||Y?Ne:H,U.linewidth+=(Pe-U.linewidth)*.15,G.opacity+=(Q-G.opacity)*.15,V.render(ke,B)}ze(),window.addEventListener(`resize`,()=>{B.aspect=z.clientWidth/z.clientHeight,B.updateProjectionMatrix(),V.setSize(z.clientWidth,z.clientHeight),U.resolution.set(z.clientWidth,z.clientHeight)});var $=document.getElementById(`cursor-glow`);window.addEventListener(`mousemove`,e=>{$.style.left=`${e.clientX}px`,$.style.top=`${e.clientY}px`}),document.querySelectorAll(`nav a, .project`).forEach(e=>{e.addEventListener(`mouseenter`,()=>$.classList.add(`hidden`)),e.addEventListener(`mouseleave`,()=>$.classList.remove(`hidden`))}),requestAnimationFrame(()=>document.body.classList.add(`page-loaded`)),window.addEventListener(`pageshow`,()=>{document.body.classList.add(`page-loaded`)}),document.querySelectorAll(`a[href]`).forEach(e=>{let t=e.getAttribute(`href`);!t||t.startsWith(`#`)||t.startsWith(`http`)||e.target===`_blank`||e.classList.contains(`project`)||e.addEventListener(`click`,e=>{e.preventDefault(),document.body.classList.remove(`page-loaded`),setTimeout(()=>{window.location.href=t},400)})}),document.querySelectorAll(`.project`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),p(e.getAttribute(`href`),e.dataset.themeColor)})});