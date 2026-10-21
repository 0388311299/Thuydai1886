"""Thao Tin Vu DN100. Run in Blender. All modelling dimensions below are mm.
Source dimensions: catalogue raster page 4/5 (01/02 JPG in this folder).
Exterior reconstruction only; unidentified detail dimensions are image estimates.
Creates new scenes and preserves all existing scene objects.
"""
import bpy, math, json, os
from mathutils import Vector, Quaternion
from math import sin, cos, pi

OUT = 'G:/My Drive/Sang kien Webgame/Tru_Thao_Tin_Vu'
P = dict(DN=100, h=490, h1=750, h2_min=800, h2_max=1010,
         H_min=1550, H_max=1760, base_diameter_web=328)
os.makedirs(OUT, exist_ok=True)
if bpy.context.object and bpy.context.object.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')
original_scene = bpy.context.scene
scene = bpy.data.scenes.new('TTV_DN100_01_Tru_noi')
bpy.context.window.scene = scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1
scene.unit_settings.length_unit = 'MILLIMETERS'
def collection(name):
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c
upper = collection('TTV | 01 Doan I - tru noi')
lower = collection('TTV | 02 Doan II III - doan ngam')
studio = collection('TTV | 90 Studio - tru noi')
root = bpy.data.objects.new('TTV_DN100 | Thong so va nguon', None)
upper.objects.link(root)
root.empty_display_type = 'PLAIN_AXES'
root.empty_display_size = .03
for k,v in P.items(): root[k] = v
root['Source'] = 'https://thaotinvu.com/tru-nuoc-chua-chay'
root['Dimension_basis'] = 'Catalogue raster pages 4-5: h=490, h1=750, h2min=800, h2max=1010, Hmin=1550, Hmax=1760 (mm).'
root['Unresolved_variant'] = 'Website prose/older PDF says h1=620; do NOT mix with 750 catalogue variant. Base D328 from web only; compatibility unconfirmed.'
root['Detail_accuracy'] = 'Visual reconstruction: body profiles, nozzle sizes, bolts, ribs, cap/hinges and flange drilling are image-based estimates; not fabrication geometry.'
root['Scope'] = 'Exterior model. No verified internal valve mechanism, threads or coupling interface.'
root['DN_note'] = 'DN100 denotes nominal inlet diameter, not outside body diameter.'

def material(name, color, metallic=0, rough=.3, cast=False):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metallic
    bs.inputs['Roughness'].default_value=rough
    if cast:
        n=m.node_tree.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value=1200
        b=m.node_tree.nodes.new('ShaderNodeBump'); b.inputs['Strength'].default_value=.12; b.inputs['Distance'].default_value=.00018
        m.node_tree.links.new(n.outputs['Fac'],b.inputs['Height']); m.node_tree.links.new(b.outputs['Normal'],bs.inputs['Normal'])
    return m
red=material('TTV | Son do gang duc',(.30,.004,.008),.18,.27,True)
yellow=material('TTV | Nap vang',(.85,.48,.003),.12,.28,True)
blue=material('TTV | Son xanh doan ngam',(.025,.18,.33),.20,.32,True)
steel=material('TTV | Inox',(.40,.46,.52),.82,.23)
brass=material('TTV | Dong thau',(.55,.31,.065),.75,.26)
dark=material('TTV | Cao su',(.013,.018,.022),0,.65)
ink=material('TTV | Chu thich',(.025,.09,.13),.05,.5)
floor_mat=material('TTV | Nen studio',(.72,.77,.80),0,.65)

def finish(o,name,mat,col,bevel=1.1,parent=True):
    o.name=name
    for c in list(o.users_collection): c.objects.unlink(o)
    col.objects.link(o)
    if mat and hasattr(o.data,'materials'): o.data.materials.append(mat)
    if parent: o.parent=root
    o['Geometry_basis']='Estimated from manufacturer photos unless named with verified catalogue dimension'
    if bevel and o.type=='MESH':
        b=o.modifiers.new('Bo mep duc','BEVEL'); b.width=bevel/1000; b.segments=3
    return o

def cyl(name,r,depth,center,mat,col=upper,axis=(0,0,1),n=64,bevel=1):
    bpy.ops.mesh.primitive_cylinder_add(vertices=n,radius=r/1000,depth=depth/1000,location=Vector(center)/1000)
    o=bpy.context.object; o.rotation_mode='QUATERNION'; o.rotation_quaternion=Vector((0,0,1)).rotation_difference(Vector(axis))
    finish(o,name,mat,col,bevel)
    for f in o.data.polygons: f.use_smooth=len(f.vertices)==4
    return o

def lathe(name,profile,mat,col=upper,origin=(0,0,0),axis=(0,0,1),n=96):
    verts=[]; faces=[]
    q=Vector((0,0,1)).rotation_difference(Vector(axis))
    for z,r in profile:
        for j in range(n):
            v=q@Vector((r*cos(2*pi*j/n),r*sin(2*pi*j/n),z))+Vector(origin)
            verts.append(tuple(v/1000))
    for i in range(len(profile)-1):
        for j in range(n):
            a=i*n+j; b=i*n+(j+1)%n
            faces.append((a,b,b+n,a+n))
    if profile[0] != profile[-1]:
        faces.append(tuple(reversed(range(n)))); faces.append(tuple((len(profile)-1)*n+j for j in range(n)))
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    o=bpy.data.objects.new(name,mesh); finish(o,name,mat,col,.7)
    for f in mesh.polygons: f.use_smooth=len(f.vertices)==4
    return o

def tube(name,ro,ri,z0,z1,mat,col=lower,origin=(0,0,0),axis=(0,0,1),n=64):
    return lathe(name,[(z0,ro),(z1,ro),(z1,ri),(z0,ri),(z0,ro)],mat,col,origin,axis,n)

def rod(name,points,r,mat,col=upper):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.resolution_u=2
    c.bevel_depth=r/1000; c.bevel_resolution=3
    p=c.splines.new('POLY'); p.points.add(len(points)-1)
    for a,v in zip(p.points,points): a.co=(*[x/1000 for x in v],1)
    o=bpy.data.objects.new(name,c); finish(o,name,mat,col,0); return o

def cube(name,loc,dim,mat,col=upper,bevel=2):
    bpy.ops.mesh.primitive_cube_add(size=1,location=Vector(loc)/1000)
    o=bpy.context.object; o.scale=Vector(dim)/1000
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,mat,col,bevel)

def bolt(name,loc,axis=(0,0,1),col=upper,size=6,mat=steel):
    cyl(name+' | dem',size*1.4,2,loc,mat,col,axis,32,.25)
    return cyl(name+' | dau luc giac',size,6,Vector(loc)+Vector(axis)*4,mat,col,axis,6,.5)

# Above-ground exterior. h1 is exactly 750 mm including operating square.
lathe('01 | Than tru gang do',[(0,148),(25,148),(33,144),(38,134),(55,134),(65,128),(105,125),(125,106),(145,91),(250,91),(262,105),(276,108),(286,105),(295,97),(615,97),(624,117),(645,117),(650,113)],red)
base=cyl('02 | Mat bich de D328 tham chieu website',164,20,(0,0,10),red,bevel=1.4)
base['Diameter_mm']=328; base['Status']='Website dimension; compatibility with catalogue h1=750 not confirmed'
lathe('03 | Nap dinh vang',[(645,116),(656,116),(665,105),(678,96),(695,84),(712,62),(724,35),(727,22)],yellow)
cyl('04 | Co ty van',18,8,(0,0,730),yellow)
key=cube('05 | Dau vuong van - moc cao 750', (0,0,742),(22,22,16),steel,bevel=.9)
key['Top_elevation_mm']=750; key['Basis']='Catalogue h1'
for i in range(32):
    a=2*pi*i/32
    pts=[(r*cos(a),r*sin(a),z) for z,r in [(660,109),(679,98),(697,85),(713,63),(724,35)]]
    rod('06 | Gan nap vang %02d'%i,pts,1.8,yellow)
for i in range(12):
    a=2*pi*i/12
    rod('07 | Gan doc chan tru %02d'%i,[(92*cos(a),92*sin(a),153),(94*cos(a),94*sin(a),160),(94*cos(a),94*sin(a),239),(92*cos(a),92*sin(a),246)],2.4,red)
for i in range(8):
    a=2*pi*(i+.5)/8
    bolt('08 | Bulong de %02d'%i,(143*cos(a),143*sin(a),35),size=6)
    bolt('09 | Bulong nap %02d'%i,(107*cos(a),107*sin(a),620),axis=(0,0,-1),size=4.5)
for i in range(16):
    a=2*pi*i/16
    pts=[]
    for j in range(13):
        t=j/12; th=a+t*(2*pi/16)*.8
        pts.append((136*cos(th),136*sin(th),48+3*sin(t*2*pi)))
    rod('10 | Hoa van chan %02d'%i,pts,1.7,red)

# Three outlet assemblies. Bore/cap detail dimensions are image estimates.
def outlet(label,direction,z,bore,rim,reach):
    d=Vector(direction); u=Vector((-d.y,d.x,0)); v=Vector((0,0,1)); center=Vector((0,0,z))
    def pt(a,b,c): return tuple(center+d*a+u*b+v*c)
    tube(label+' | Co hong',bore+10,bore,70,reach-20,red,upper,center,d)
    tube(label+' | Bac dong',rim-3,bore,reach-25,reach-7,brass,upper,center,d)
    cyl(label+' | Nap tron',rim,20,pt(reach,0,0),red,axis=d)
    cyl(label+' | Loi nap',rim*.28,16,pt(reach+17,0,0),red,axis=d)
    cyl(label+' | Luc giac ngoai',rim*.20,16,pt(reach+32,0,0),red,axis=d,n=6,bevel=1)
    for j in range(32):
        a=2*pi*j/32
        r1=rim*.34; r2=rim*.86
        rod(label+' | Gan toa %02d'%j,[pt(reach+10,r1*cos(a),r1*sin(a)),pt(reach+11,(r1+r2)/2*cos(a+.025),(r1+r2)/2*sin(a+.025)),pt(reach+10,r2*cos(a+.05),r2*sin(a+.05))],1.3,red)
    # Cap retaining U arm and pivot pin, visible in product photographs.
    pts=[pt(reach+38,-12,12),pt(reach+39,-12,-rim*.9),pt(reach+27,-12,-rim-17),pt(reach-18,-12,-rim-17),pt(reach-28,-12,-rim-8)]
    rod(label+' | Tay giu nap trai',pts,5,red)
    rod(label+' | Tay giu nap phai',[tuple(Vector(p)+u*24) for p in pts],5,red)
    cyl(label+' | Chot ban le',7,46,pt(reach-25,0,-rim-8),steel,axis=u,n=32)
    for k in range(2): bolt(label+' | Bulong chot '+str(k),pt(reach-25,(-1 if k==0 else 1)*25,-rim-8),axis=u if k else -u,size=6)
outlet('11 | Hong lon phia truoc',(0,-1,0),438,50,79,188)
outlet('12 | Hong nho ben phai',(1,0,0),490,32.5,59,157)
outlet('13 | Hong nho ben trai',(-1,0,0),490,32.5,59,157)

# Cast branding in the same position as the reference photograph.
def text_obj(name,text,loc,size,mat,col=upper,rotation=(pi/2,0,0),align='CENTER',extrude=.3):
    c=bpy.data.curves.new(name,'FONT'); c.body=text; c.size=size/1000; c.align_x=align; c.extrude=extrude/1000; c.bevel_depth=.0001
    o=bpy.data.objects.new(name,c); o.location=Vector(loc)/1000; o.rotation_euler=rotation
    finish(o,name,mat,col,0,parent=col in (upper,lower)); return o
text_obj('14 | Chu dap noi','THAO TIN VU',(0,-98,580),12,red)
text_obj('15 | Co danh nghia','DN100',(0,-98,561),11,red)
rod('16 | Bieu trung theo anh',[(-20,-98,538),(0,-100,565),(20,-98,538),(-20,-98,538),(0,-100,513),(20,-98,538)],1.3,red)

# Underground portion at the minimum catalogue configuration, h2=800 mm.
lathe('20 | Bau duoi tham chieu D190',[(0,150),(-18,150),(-23,98),(-50,95),(-102,91),(-143,75),(-160,66)],blue,lower)
tube('21 | Co long dieu chinh',73,61,-260,-150,blue)
for i in range(16):
    z=-165-i*5.6
    tube('22 | Vong go dieu chinh %02d'%i,75,72,z,z+2,blue)
tube('23 | Ong dung ngam',62,50,-590,-250,blue)
for z,r,d in [(-265,103,16),(-287,103,16),(-235,83,28)]:
    tube('24 | Bich kep '+str(z),r,62,z-d/2,z+d/2,blue)
for i in range(6):
    a=2*pi*i/6
    loc=(89*cos(a),89*sin(a),-254)
    bolt('25 | Bulong kep %02d'%i,loc,col=lower,size=7)
    cyl('26 | Ty kep %02d'%i,4,58,(loc[0],loc[1],-278),steel,lower,n=24)
    bolt('27 | Ecu kep %02d'%i,(loc[0],loc[1],-310),axis=(0,0,-1),col=lower,size=7)
# Hollow quarter-turn elbow in the YZ plane, inlet faces forward (-Y).
verts=[]; faces=[]; n=64; rings=25
for rad in (62,50):
    for i in range(rings):
        t=(pi/2)*i/(rings-1)
        center=Vector((0,-100+100*cos(t),-590-100*sin(t)))
        side=Vector((0,cos(t),-sin(t)))
        for j in range(n):
            a=2*pi*j/n; verts.append(tuple((center+Vector((1,0,0))*rad*cos(a)+side*rad*sin(a))/1000))
for layer in range(2):
    offset=layer*rings*n
    for i in range(rings-1):
        for j in range(n):
            a=offset+i*n+j; b=offset+i*n+(j+1)%n
            faces.append((a,b,b+n,a+n) if layer==0 else (a+n,b+n,b,a))
for ring in (0,rings-1):
    for j in range(n):
        a=ring*n+j; b=ring*n+(j+1)%n
        faces.append((a,b,b+rings*n,a+rings*n))
me=bpy.data.meshes.new('Co 90 hollow'); me.from_pydata(verts,[],faces); me.update()
o=bpy.data.objects.new('28 | Co 90 DN100',me); finish(o,o.name,blue,lower,.5)
for f in me.polygons:f.use_smooth=True
tube('29 | Co ngang dau vao',62,50,100,175,blue,lower,(0,0,-690),(0,-1,0))
flange=tube('30 | Mat bich dau vao DN100',110,50,175,193,blue,lower,(0,0,-690),(0,-1,0))
flange['Drilling']='8 holes D18, PCD180 are provisional visual detail, not verified from this product drawing'
# Actual holes in inlet flange, retaining modifiers for editability.
for i in range(8):
    a=2*pi*(i+.5)/8
    cutter=cyl('TMP hole',9,40,(90*cos(a),-184,-690+90*sin(a)),None,lower,(0,-1,0),n=32,bevel=0)
    mod=flange.modifiers.new('Lo bulong %02d'%i,'BOOLEAN'); mod.operation='DIFFERENCE'; mod.object=cutter
    cutter.hide_render=True; cutter.hide_set(True); cutter.display_type='WIRE'
    cutter.name='TTV | Dung cu lo bich %02d'%i
cube('31 | Chan co - moc sau 800',(0,-55,-790),(148,100,20),blue,lower,2)
rod('32 | Gan do chan trai',[(-50,-15,-710),(-50,-15,-780),(-50,-100,-780)],6,blue,lower)
rod('33 | Gan do chan phai',[(50,-15,-710),(50,-15,-780),(50,-100,-780)],6,blue,lower)

def configure(s):
    s.render.engine='BLENDER_EEVEE'; s.cycles.samples=48
    s.cycles.use_denoising=True
    s.render.resolution_x=1400; s.render.resolution_y=1600; s.render.resolution_percentage=100
    s.world=bpy.data.worlds.new(s.name+' World'); s.world.use_nodes=True
    s.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.72,.82,1)
    s.world.node_tree.nodes['Background'].inputs[1].default_value=.22
    s.view_settings.view_transform='AgX'
    s.view_settings.exposure=-.35
    s.render.image_settings.file_format='PNG'
def camera(s,col,name,loc,target,scale):
    data=bpy.data.cameras.new(name); o=bpy.data.objects.new(name,data); col.objects.link(o)
    o.location=loc; o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
    data.type='ORTHO'; data.ortho_scale=scale; data.lens=55; s.camera=o; return o
def light(col,name,loc,power,size,target):
    d=bpy.data.lights.new(name,'AREA'); d.energy=power; d.shape='DISK'; d.size=size
    o=bpy.data.objects.new(name,d); col.objects.link(o); o.location=loc
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
configure(scene)
camera(scene,studio,'TTV | Camera tru noi',(1.25,-2.1,1.05),(0,-.02,.36),1.04)
light(studio,'TTV | Key',(-1,-1.5,2),100,1.4,(0,0,.35))
light(studio,'TTV | Fill',(1.4,-.5,1.1),70,1.1,(0,0,.35))
light(studio,'TTV | Rim',(.5,1,1.8),150,1,(0,0,.35))
cube('TTV | San tru noi',(0,0,-7),(20000,20000,10),floor_mat,studio,0)
# Separate assembled scene with the same editable model collections.
full=bpy.data.scenes.new('TTV_DN100_02_Toan_bo')
full.collection.children.link(upper); full.collection.children.link(lower)
full.unit_settings.system='METRIC'; full.unit_settings.length_unit='MILLIMETERS'
fullstudio=bpy.data.collections.new('TTV | 91 Studio - toan bo'); full.collection.children.link(fullstudio)
configure(full)
camera(full,fullstudio,'TTV | Camera toan bo',(1.55,-3,1.0),(0,-.025,-.025),1.96)
light(fullstudio,'TTV | Key full',(-1,-2,2),140,1.5,(0,0,0))
light(fullstudio,'TTV | Fill full',(1.5,-1,1),95,1.2,(0,0,0))
light(fullstudio,'TTV | Rim full',(0,1,1.8),180,1.3,(0,0,0))
cube('TTV | San toan bo',(0,0,-807),(20000,20000,10),floor_mat,fullstudio,0)
# Ground-level contour in full assembly; no soil hides the buried components.
rod('TTV | Mat dat z0',[(-270,80,0),(-270,270,0),(270,270,0),(270,80,0)],1.2,ink,fullstudio)
dimcol=bpy.data.collections.new('TTV | 03 Kich thuoc catalogue'); full.collection.children.link(dimcol)
def dim(name,x,z0,z1,label,side=1):
    y=-245
    rod(name+' | duong do',[(x,y,z0),(x,y,z1)],.75,ink,dimcol)
    for z in (z0,z1):
        rod(name+' | gioi han '+str(z),[(x-side*25,y,z),(x+side*16,y,z)],.65,ink,dimcol)
    for z,sgn in ((z0,1),(z1,-1)):
        rod(name+' | mui ten '+str(z),[(x-5,y,z+sgn*13),(x,y,z),(x+5,y,z+sgn*13)],.8,ink,dimcol)
    rot=full.camera.rotation_euler
    text_obj(name+' | so do',label,(x+side*64,y,(z0+z1)/2),27,ink,dimcol,rot,extrude=0)
dim('h1',330,0,750,'750 mm')
dim('h2 min',330,-800,0,'800 mm')
dim('H min',-310,-800,750,'1550 mm',-1)
text_obj('TTV | Tieu de toan bo','THAO TIN VU / DN100',(0,0,875),31,ink,dimcol,full.camera.rotation_euler,extrude=0)
# Exclude underground and its cutting tools from the upper-only scene.
scene.view_layers[0].layer_collection.children[lower.name].exclude=True

readme='''TRỤ NƯỚC CHỮA CHÁY THẢO TÍN VŨ - DN100

Hai scene: 01_Tru_noi và 02_Toan_bo. Scene gốc được giữ nguyên.
Đơn vị hình học nội bộ: m; số đo trong bảng/ghi chú: mm. Mặt đất z=0.
Catalogue hình trang 4-5: h=490; h1=750; h2min=800; h2max=1010;
Hmin=1550; Hmax=1760 mm. Mô hình lắp ở cấu hình ngắn nhất.
h được đặt tại tâm hai họng bên. DN100 là cỡ danh nghĩa đầu vào.

LƯU Ý NGUỒN:
Website và PDF 4 trang cũ ghi chiều cao phần nổi 620 mm, khác catalogue
hình trang 4-5 ghi 750 mm. Mô hình này chọn biến thể catalogue 750 mm.
D328 đáy là số tham chiếu từ website, chưa có bản vẽ xác nhận tương thích
với biến thể 750 mm. Không được coi toàn bộ mô hình đã xác nhận chế tạo.

CÁC CHI TIẾT ƯỚC LƯỢNG THEO ẢNH:
Biên dạng thân/nắp, đường kính thân, họng ra, vị trí họng lớn,
hoa văn, tay giữ, bulông, bích đầu vào/lỗ bulông, ren và chân co.
Không dựng cơ cấu van bên trong. Không có ren/lắp ghép chức năng đã xác nhận.
Mô hình phục vụ hình dung, trình bày và chỉnh sửa hình học.

Nguồn: https://thaotinvu.com/tru-nuoc-chua-chay
Catalogue hình: https://thaotinvu.com/upload/images/4%20tru%20dung.jpg
https://thaotinvu.com/upload/images/5%20tru%20dung%202%20copy.jpg
Đối chiếu cũ: https://thaotinvu.com/upload/news/835923016029.pdf
Ngày truy cập: 16/10/2026.
'''
txt=bpy.data.texts.new('TTV_DN100_DOC_TRUOC'); txt.write(readme)
with open(os.path.join(OUT,'Nguon_va_kich_thuoc_DN100.txt'),'w',encoding='utf-8') as f:f.write(readme)
with open(os.path.join(OUT,'Thong_so_DN100.json'),'w',encoding='utf-8') as f:json.dump(P,f,ensure_ascii=False,indent=2)
# Embed source raster references; not displayed as model geometry.
for filename in ['01_cau_tao_goc.jpg','02_kich_thuoc_goc.jpg','03_anh_san_pham.jpg']:
    im=bpy.data.images.load(os.path.join(OUT,filename),check_existing=True); im.pack()
bpy.context.window.scene=scene
bpy.ops.object.select_all(action='DESELECT')
body=bpy.data.objects.get('01 | Than tru gang do'); body.select_set(True); bpy.context.view_layer.objects.active=body
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':
        sp=area.spaces.active; sp.region_3d.view_perspective='CAMERA'
        sp.shading.type='MATERIAL'; sp.overlay.show_floor=False
scene.render.filepath=os.path.join(OUT,'Tru_DN100_phoi_canh.png')
full.render.filepath=os.path.join(OUT,'Tru_DN100_toan_bo.png')
bpy.context.view_layer.update()
blend_path=os.path.join(OUT,'Tru_Thao_Tin_Vu_DN100.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend_path,check_existing=False,compress=True)
result={'blend_file':blend_path,'scene_original_preserved':original_scene.name,'scene_main':scene.name,'scene_assembly':full.name,'objects_upper':len(upper.objects),'objects_lower':len(lower.objects),'parameters_mm':P}
