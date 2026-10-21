import bpy, math, os, json
from mathutils import Vector, Quaternion
from pathlib import Path

ASSETS=Path('C:/Users/ktsth/.codex/visualizations/2026/10/16/01a1454c-7ca6-7ff3-8292-9c51a2ab0a3f/tru_nuoc')
OUT=Path('G:/My Drive/Sang kien Webgame/models/Tru_nuoc_tai_voi_20261016')
OUT.mkdir(parents=True,exist_ok=True)
assert not (OUT/'Tru_nuoc_SAWACO.blend').exists(), 'Output exists; choose a new output path before rebuilding.'
assert 'TRU_NUOC_SAWACO' not in bpy.data.scenes, 'Model scene already exists; inspect before rebuilding.'
scene=bpy.data.scenes.new('TRU_NUOC_SAWACO')
bpy.context.window.scene=scene
scene.unit_settings.system='METRIC'
scene.unit_settings.length_unit='MILLIMETERS'
scene.unit_settings.scale_length=1
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1400
scene.render.resolution_y=1600
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.view_settings.view_transform='AgX'
scene.world=bpy.data.worlds.new('SW_Studio_world')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(0.32,0.38,0.46,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.45

def collection(name):
    c=bpy.data.collections.new(name); scene.collection.children.link(c);return c
body_col=collection('01_THAN_TRU_va_CHAU__uoc_luong_theo_anh')
tap_col=collection('02_VOI_BAM__uoc_luong_85mm')
logo_col=collection('03_NHAN_DIEN_SAWACO')
base_col=collection('04_BE_DA__theo_PDF_trang_2')
structure_col=collection('05_KET_CAU_AN__PDF_D10_M10_D120')
pipe_col=collection('06_CAP_THOAT__duong_kinh_PDF_tuyen_uoc_luong')
stage_col=collection('07_STUDIO')
scale_col=collection('08_NGUOI_1700mm__minh_hoa_ty_le')
current_col=body_col
CX=.2; Z0=.25; H=1.1; RT=.225; RB=.16; TOP=Z0+H

def adopt(o,name,mat=None,col=None,source='UOC LUONG theo anh; khong phai kich thuoc che tao'):
    o.name=name
    for c in list(o.users_collection): c.objects.unlink(o)
    (col or current_col).objects.link(o)
    if mat:o.data.materials.append(mat)
    o['nguon']=source
    return o

def material(name,color,metal=0,rough=.4):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough
    return m
steel=material('INOX_xuoc__vat_lieu_minh_hoa',(.53,.58,.62),1,.25)
chrome=material('Chrome_voi_va_vien',(.7,.74,.78),1,.15)
dark=material('Muc_den',(.009,.013,.018),.05,.44)
rubber=material('Cao_su',(.012,.016,.02),0,.7)
brass=material('Dong_phu_kien',(.34,.20,.06),.8,.3)
blue=material('LLDPE_cap_OD27',(.018,.17,.35),.05,.34)
pvc=material('PVC_thoat_D42',(.54,.57,.6),0,.4)
rebar=material('Thep_cot_D10',(.15,.18,.21),.7,.5)
concrete=material('Beton_M250',(.35,.37,.39),0,.9)
brick=material('Xay_gach_M75',(.36,.16,.09),0,.9)
grout=material('Vua_ximang_20mm',(.4,.4,.38),0,.85)
granite=material('Granit_xam_20mm',(.28,.32,.34),.03,.3)
floor_mat=material('Studio_nen_xam',(.115,.14,.16),0,.72)
person_mat=material('Nguoi_ty_le_1700mm',(.25,.31,.34),0,.63)
label_mat=material('Chu_ky_thuat_sang',(.8,.87,.92),0,.65)

# Fine physical-scale satin finish; no photo texture baked into the model.
nodes=steel.node_tree.nodes;links=steel.node_tree.links
tex=nodes.new('ShaderNodeTexCoord');mapping=nodes.new('ShaderNodeVectorMath');mapping.operation='MULTIPLY';mapping.inputs[1].default_value=(3000,3000,35)
noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=1;noise.inputs['Detail'].default_value=2
bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.00012
links.new(tex.outputs['Generated'],mapping.inputs[0]);links.new(mapping.outputs[0],noise.inputs['Vector']);links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])
bs=nodes.get('Principled BSDF')
if 'Anisotropic IOR Level' in bs.inputs:bs.inputs['Anisotropic IOR Level'].default_value=.35
nodes=granite.node_tree.nodes;links=granite.node_tree.links
noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=210;noise.inputs['Detail'].default_value=2.3
ramp=nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.28;ramp.color_ramp.elements[0].color=(.045,.065,.075,1);ramp.color_ramp.elements[1].position=.72;ramp.color_ramp.elements[1].color=(.48,.53,.56,1)
bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.2;bump.inputs['Distance'].default_value=.0004
links.new(noise.outputs['Fac'],ramp.inputs[0]);links.new(ramp.outputs[0],nodes.get('Principled BSDF').inputs['Base Color']);links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs[0],nodes.get('Principled BSDF').inputs['Normal'])

def smooth(o):
    if o.type=='MESH':
        for p in o.data.polygons:p.use_smooth=True
    return o
def bevel(o,width=.002,segments=3):
    m=o.modifiers.new('Bo_canh','BEVEL');m.width=width;m.segments=segments
    return o
def box(name,loc,dims,mat,col=None,bev=.002,source='PDF trang 2; kich thuoc mm'):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=adopt(bpy.context.object,name,mat,col,source)
    o.dimensions=dims;bpy.context.view_layer.objects.active=o;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bev:bevel(o,bev)
    return o
def cyl(name,loc,r,depth,mat,col=None,vertices=64,source='UOC LUONG theo anh'):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc)
    o=adopt(bpy.context.object,name,mat,col,source);smooth(o);return o
def sphere(name,loc,scale,mat,col=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,radius=1,location=loc)
    o=adopt(bpy.context.object,name,mat,col);o.scale=scale;smooth(o);return o
def tube(name,points,r,mat,col=None,spline='BEZIER',source='Tuyen di minh hoa; duong kinh theo PDF'):
    cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.resolution_u=18;cu.bevel_depth=r;cu.bevel_resolution=4
    sp=cu.splines.new(spline)
    if spline=='BEZIER':
        sp.bezier_points.add(len(points)-1)
        for b,p in zip(sp.bezier_points,points):b.co=p;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
    else:
        sp.points.add(len(points)-1)
        for b,p in zip(sp.points,points):b.co=(*p,1)
    o=bpy.data.objects.new(name,cu);(col or current_col).objects.link(o);o.data.materials.append(mat);o['nguon']=source;return o
def between(name,a,b,r,mat,col=None):
    a,b=Vector(a),Vector(b);o=cyl(name,(a+b)/2,r,(b-a).length,mat,col);o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o
def lathe(name,profile,mat,col=None,segments=192,center=(CX,0)):
    verts=[];faces=[]
    for radius,z in profile:
        for i in range(segments):
            a=2*math.pi*i/segments;verts.append((center[0]+radius*math.cos(a),center[1]+radius*math.sin(a),z))
    for j in range(len(profile)-1):
        for i in range(segments):faces.append((j*segments+i,j*segments+(i+1)%segments,(j+1)*segments+(i+1)%segments,(j+1)*segments+i))
    me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);(col or current_col).objects.link(o);o.data.materials.append(mat);o['nguon']='UOC LUONG theo anh: H1100 D450/D320, ton1.5mm';smooth(o);return o

# Tapered shell with actual inner wall, separate spun basin, rolled lip and drain.
shell=lathe('Than_con_INOX__H1100_D450_D320_T1p5_UOC_LUONG',[(RB,Z0),(RT,TOP),(RT-.0015,TOP),(RB-.0015,Z0),(RB,Z0)],steel)
shell['H_mm']=1100;shell['D_mieng_mm']=450;shell['D_chan_mm']=320;shell['ton_mm_UOC_LUONG']=1.5
profile=[(.2245,TOP-.002),(.225,TOP),(.2235,TOP+.0015),(.220,TOP+.002),(.216,TOP),(.212,TOP-.004),(.202,TOP-.009),(.184,TOP-.019),(.16,TOP-.033),(.13,TOP-.049),(.10,TOP-.061),(.07,TOP-.069),(.025,TOP-.075),(.022,TOP-.078)]
basin=lathe('Chau_thu_nuoc_INOX__sau75_UOC_LUONG',profile,steel)
sol=basin.modifiers.new('Ton_chau_1p2mm_uoc_luong','SOLIDIFY');sol.thickness=.0012
lathe('Vien_cuon_mieng_chau',[(.222,TOP-.004),(.2255,TOP-.001),(.2255,TOP+.001),(.223,TOP+.003),(.22,TOP+.001)],chrome)
lathe('Nep_chan_tru',[(.1605,Z0),(.1605,Z0+.008),(.159,Z0+.009)],chrome)
drain=cyl('Lo_thoat_chau_D42', (CX,0,TOP-.079),.021,.004,dark)
lathe('Vien_lo_thoat',[(.022,TOP-.077),(.024,TOP-.074),(.027,TOP-.074),(.027,TOP-.076)],chrome)
for i in range(4):
    x=(i-1.5)*.009
    ln=2*math.sqrt(max(.021**2-x*x,0))
    box('Luoi_chan_rac_%02d'%i,(CX+x,0,TOP-.075),(.0018,ln,.0012),chrome,body_col,bev=.0005,source='Luoi minh hoa theo chuc nang')

# Small chrome push bubbler, set near the rear rim; appearance based on supplied image.
current_col=tap_col
FX=CX;FY=.154
cyl('Gioang_de_voi',(FX,FY,TOP+.001),.023,.003,rubber)
lathe('Voi__de_va_than',[(.023,TOP+.002),(.023,TOP+.005),(.019,TOP+.009),(.012,TOP+.015),(.011,TOP+.030),(.014,TOP+.045),(.018,TOP+.054),(.018,TOP+.065),(.015,TOP+.074),(.010,TOP+.078)],chrome,center=(FX,FY),segments=96)
sphere('Dau_voi_bubbler',(FX,FY-.005,TOP+.067),(.018,.021,.018),chrome)
nozzle=between('Dau_phun_cheo',(FX,FY-.015,TOP+.067),(FX,FY-.026,TOP+.079),.007,chrome)
aperture=between('Lo_phun',(FX,FY-.027,TOP+.080),(FX,FY-.028,TOP+.081),.003,dark)
button=between('Nut_bam',(FX,FY+.014,TOP+.055),(FX,FY+.024,TOP+.055),.009,chrome)
button['nguon']='Vi tri nut bam UOC LUONG, khong xac nhan model nha san xuat'
for dz in [.012,.017]:lathe('Vong_khop_voi',[(.012,TOP+dz),(.013,TOP+dz+.001),(.012,TOP+dz+.002)],chrome,center=(FX,FY),segments=64)

# Official SAWACO logo: original alpha is used as a black print, conforming to the cone.
current_col=logo_col
logo=bpy.data.images.load(str(ASSETS/'logo_sawaco.png'),check_existing=True)
logo.pack()
ink=bpy.data.materials.new('Logo_chinh_thuc_SAWACO__in_den');ink.use_nodes=True
ns=ink.node_tree.nodes;ls=ink.node_tree.links;ns.clear()
im=ns.new('ShaderNodeTexImage');im.image=logo
trans=ns.new('ShaderNodeBsdfTransparent');pr=ns.new('ShaderNodeBsdfPrincipled');pr.inputs['Base Color'].default_value=(.006,.008,.01,1);pr.inputs['Roughness'].default_value=.4
mix=ns.new('ShaderNodeMixShader');output=ns.new('ShaderNodeOutputMaterial')
ls.new(im.outputs['Alpha'],mix.inputs[0]);ls.new(trans.outputs[0],mix.inputs[1]);ls.new(pr.outputs[0],mix.inputs[2]);ls.new(mix.outputs[0],output.inputs[0])
def radius(z):return RB+(RT-RB)*(z-Z0)/H
def decal():
    w=.19;h=w*824/918;bottom=TOP-.238;verts=[];faces=[];uvs=[];nx=64;ny=12
    for j in range(ny+1):
        for i in range(nx+1):
            u=i/nx;v=j/ny;z=bottom+h*v;r=radius(z)+.0007;a=(u-.5)*w/r
            verts.append((CX+r*math.sin(a),-r*math.cos(a),z));uvs.append((u,v))
    for j in range(ny):
        for i in range(nx):
            k=j*(nx+1)+i;faces.append((k,k+1,k+nx+2,k+nx+1))
    me=bpy.data.meshes.new('Logo_cone_mesh');me.from_pydata(verts,[],faces);me.update();uv=me.uv_layers.new(name='UVMap')
    for p in me.polygons:
        for l in p.loop_indices:uv.data[l].uv=uvs[me.loops[l].vertex_index]
    o=bpy.data.objects.new('Logo_SAWACO_chinh_thuc_in_den',me);logo_col.objects.link(o);o.data.materials.append(ink);smooth(o)
    o['nguon']='Logo chinh thuc: https://portalapi.sawaco.com.vn/Upload/Tmp/Account/admin/20230614201052807_logo_chuan.png ; chuyen mau bang shader, khong ve lai'
decal()
font=bpy.data.fonts.load('C:/Windows/Fonts/arialbd.ttf')
def wrapped_text(name,body,z,width):
    cu=bpy.data.curves.new(name,'FONT');cu.body=body;cu.align_x='CENTER';cu.align_y='BOTTOM_BASELINE';cu.size=1;cu.font=font;cu.resolution_u=12
    o=bpy.data.objects.new(name,cu);logo_col.objects.link(o);bpy.context.view_layer.update()
    scale=width/o.dimensions.x
    for a in bpy.context.selected_objects:a.select_set(False)
    o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
    for v in o.data.vertices:
        x,y,depth=v.co*scale;zz=z+y;r=radius(zz)+.0008+depth;a=x/r;v.co=(CX+r*math.sin(a),-r*math.cos(a),zz)
    o.data.materials.append(dark);o['editable_text_source']=body;o['nguon']='Noi dung theo anh nguoi dung';return o
wrapped_text('Nhan_NUOC_UONG_TRUC_TIEP','NƯỚC UỐNG TRỰC TIẾP',TOP-.285,.282)
wrapped_text('Nhan_Drinking_water','Drinking water',TOP-.340,.181)

# Approved foundation dimensions. Top surface is datum +250 mm above grass.
current_col=base_col
rc=box('Be_BT_M250__1000x1000x150',(0,0,.135),(1,1,.15),concrete,bev=.001)
def bore(obj):
    cutter=cyl('Temp_lo_D120',(.2,0,.1),.06,1,concrete,base_col,96)
    mod=obj.modifiers.new('Lo_cho_D120_theo_PDF','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cutter
    bpy.context.view_layer.objects.active=obj
    try:bpy.ops.object.modifier_apply(modifier=mod.name)
    finally:bpy.data.objects.remove(cutter,do_unlink=True)
bore(rc)
mortar=box('Vua_M75__day20',(0,0,.22),(1,1,.02),grout,bev=0);bore(mortar)
stone=box('Mat_da_granit__1040x1080x20',(0,0,.24),(1.04,1.08,.02),granite,bev=.001);bore(stone)
box('Op_da_mat_truoc__1040x250x20',(0,-.53,.105),(1.04,.02,.25),granite,bev=.001)
for x in [-.51,.51]:box('Op_da_ben__250x1040x20',(x,0,.105),(.02,1.04,.25),granite,bev=.001)
current_col=structure_col
brick_obj=box('Xay_gach_nang_cao_do__cao200',(0,0,-.04),(1,1,.2),brick,bev=0);bore(brick_obj)
box('Beton_lot_M100__day100',(0,0,-.19),(1.1,1.1,.1),concrete,bev=0)
for axis in ['X','Y']:
    for i in range(8):
        v=-.475+i*.95/7;z=.09 if axis=='X' else .101
        pts=([(-.475,v,z),(.475,v,z)] if axis=='X' else [(v,-.475,z),(v,.475,z)])
        # Retain 8 bars per direction; shift one clear of the service sleeve.
        if axis=='Y' and abs(v-.2)<.06:
            pts=[(.27,-.475,z),(.27,.475,z)]
        tube('Thep_%s_%02d__D10_L950'%(axis,i),pts,.005,rebar,structure_col,'POLY',source='PDF trang 2: 8D10 moi phuong, L950; mo hinh minh hoa vi tri')
for i in range(4):
    a=math.pi/4+i*math.pi/2;x=CX+.115*math.cos(a);y=.115*math.sin(a)
    tube('Neo_J_M10_%d'%i,[(x+.025,y,.082),(x,y,.082),(x,y,.12),(x,y,.277)],.005,rebar,structure_col,source='PDF: neo J M10; so luong 4 va tam neo 230 uoc luong')
    cyl('Long_den_M10_%d'%i,(x,y,.255),.012,.002,chrome,structure_col)
    cyl('Dai_oc_M10_%d'%i,(x,y,.262),.009,.009,chrome,structure_col,6)

# Concealed service layout, indicative routing following the drawing, not a fabricated filter specification.
current_col=pipe_col
tube('Cap_LLDPE_OD27',[(CX-.03,0,-.36),(CX-.03,0,.02),(CX-.07,0,.08),(CX-.07,0,.42)],.0135,blue,pipe_col)
tube('Ong_thoat_PVC_D42',[(CX,0,TOP-.082),(CX,0,1.02),(CX+.018,.012,.66),(CX+.02,.012,.18),(CX+.02,.012,-.33),(CX+.30,.012,-.36)],.021,pvc,pipe_col)
tube('Day_cap_INOX_ren_1_2_vao_voi',[(CX-.07,0,.72),(CX-.09,.04,.94),(FX,FY,TOP-.03)],.006,chrome,pipe_col)
tube('Day_cap_INOX_ren_1_2_tu_duoi',[(CX-.07,0,.42),(CX-.13,-.03,.49),(CX-.07,0,.72)],.006,chrome,pipe_col)
for i,z in enumerate([.44,.70]):
    cyl('Van_bi_1_2_%d'%i,(CX-.07,0,z),.016,.038,brass,pipe_col,8)
    box('Tay_van_%d'%i,(CX-.04,0,z+.012),(.055,.009,.007),blue,pipe_col,bev=.002,source='Van bi 1/2 theo PDF; hinh dang uoc luong')
pipe_col['ghi_chu']='Duong kinh theo PDF. Tuyến, cao độ, hình dáng phụ kiện chỉ minh hoạ; không mô phỏng thiết bị nội bộ chưa định danh.'

# Neutral mannequin is available in technical scene only, for a clearly labelled 1.70 m scale.
current_col=scale_col
PX=-.95;PY=.30
sphere('Nguoi_1700__Dau',(PX,PY,1.59),(.09,.095,.11),person_mat)
sphere('Nguoi_1700__Than',(PX,PY,1.20),(.18,.10,.25),person_mat)
sphere('Nguoi_1700__Hong',(PX,PY,.94),(.145,.09,.13),person_mat)
for side in [-1,1]:
    hip=(PX+side*.08,PY,.94);knee=(PX+side*.09,PY,.54);ankle=(PX+side*.1,PY,.08)
    between('Nguoi__Dui',hip,knee,.065,person_mat);between('Nguoi__Cang_chan',knee,ankle,.044,person_mat)
    sphere('Nguoi__Ban_chan',(PX+side*.10,PY-.055,.045),(.055,.13,.045),person_mat)
    shoulder=(PX+side*.17,PY,1.38);elbow=(PX+side*.235,PY,1.13);hand=(PX+side*.245,PY-.02,.93)
    between('Nguoi__Tay_tren',shoulder,elbow,.04,person_mat);between('Nguoi__Tay_duoi',elbow,hand,.033,person_mat);sphere('Nguoi__Ban_tay',hand,(.035,.027,.055),person_mat)
between('Nguoi__Co',(PX,PY,1.41),(PX,PY,1.49),.045,person_mat)
scale_col['ghi_chu']='Hinh nhan cao 1700mm la moc ty le minh hoa, khong phai so do nhan trac nguoi trong anh.'

current_col=stage_col
box('San_studio_chinh__cot_co_0',(0,0,-.025),(200,200,.05),floor_mat,base_col,bev=0,source='Bo canh trinh bay')
def camera(name,loc,target,lens=50):
    d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);stage_col.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.lens=lens;d.clip_start=.01;return o
cam=camera('Camera_TONG_THE',(2.2,-4.1,2.7),(.04,0,.61),72)
scene.camera=cam
def area(name,loc,power,size,color,target=(.15,0,.8),shape='DISK',size_y=None):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape=shape;d.size=size;d.color=color
    if size_y is not None:d.size_y=size_y
    o=bpy.data.objects.new(name,d);stage_col.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
area('Softbox_trai',(-2.2,-2.1,2.4),260,1.8,(.85,.91,1),shape='RECTANGLE',size_y=3.0)
area('Strip_phai',(1.4,.0,1.8),330,.7,(1,.94,.84),shape='RECTANGLE',size_y=2.8)
area('Softbox_dinh',(.2,1.2,3.4),320,1.6,(.88,.94,1))
area('Fill_truoc',(-.2,-3,1.2),55,1.8,(1,1,1))

# Separate technical scene shows the concealed pipework without changing the main model.
tech=bpy.data.scenes.new('TRU_NUOC_KY_THUAT')
tech.unit_settings.system='METRIC';tech.unit_settings.length_unit='MILLIMETERS'
tech.world=scene.world;tech.render.engine='CYCLES';tech.cycles.samples=32;tech.cycles.use_denoising=True
tech.render.resolution_x=1600;tech.render.resolution_y=1400;tech.render.resolution_percentage=100;tech.render.image_settings.file_format='PNG';tech.view_settings.view_transform='AgX'
for c in [tap_col,structure_col,pipe_col,stage_col,scale_col]:tech.collection.children.link(c)
tech_col=bpy.data.collections.new('09_KY_THUAT_tham_khao');tech.collection.children.link(tech_col)
# Shell silhouette in wire form is readable alongside the plumbing.
for a in [-math.pi/2,0,math.pi/2,math.pi]:
    tube('Bien_dang_than_tru',[(CX+RB*math.cos(a),RB*math.sin(a),Z0),(CX+RT*math.cos(a),RT*math.sin(a),TOP)],.0017,chrome,tech_col,'POLY')
for z,r in [(Z0,RB),(TOP,RT)]:
    pts=[(CX+r*math.cos(i*2*math.pi/128),r*math.sin(i*2*math.pi/128),z) for i in range(129)]
    tube('Vong_bien_dang',pts,.0017,chrome,tech_col,'POLY')
# Open section of RC slab, with the central sleeve and reinforcement visible.
bpy.context.window.scene=tech
box('San_studio_ky_thuat',(0,0,-.265),(200,200,.05),floor_mat,tech_col,bev=0,source='Bo canh trinh bay')
box('Moc_cao_do_co_0__nguoi_ty_le',(-.95,.30,-.12),(.55,.55,.24),floor_mat,tech_col,bev=0,source='Moc ty le minh hoa')
for x1,x2,y1,y2 in [(-.5,.5,.12,.5),(-.5,.14,0,.12),(.26,.5,0,.12)]:
    box('Be_BT_mat_cat',( (x1+x2)/2,(y1+y2)/2,.135),(x2-x1,y2-y1,.15),concrete,tech_col,bev=.001,source='Minh hoa mat cat be 1000x1000x150, lo D120')
tech_cam=camera('Camera_KY_THUAT',(2.6,-4.4,2.6),(-.22,0,.75),64)
tech.camera=tech_cam
def tech_text(body,loc,size=.04):
    cu=bpy.data.curves.new(body,'FONT');cu.body=body;cu.font=font;cu.size=size;cu.align_x='LEFT'
    o=bpy.data.objects.new(body,cu);tech_col.objects.link(o);cu.materials.append(label_mat);o.location=loc;o.rotation_euler=(math.pi/2,0,0);return o
tech_text('1.700 mm | MỐC TỶ LỆ',(-1.2,-.02,1.87),.045)
tech_text('THÂN: H 1.100 | Ø450 / Ø320',(-.1,-.15,1.57),.035)
tech_text('ƯỚC LƯỢNG THEO ẢNH',(-.1,-.15,1.51),.028)
tech_text('CẤP OD27 | THOÁT D42',(.60,-.1,.82),.035)
tech_text('NEO M10 | THÉP Ø10',(.60,-.1,.71),.035)
bt_label=tech_text('BỆ BT 1.000 × 1.000 × 150',(-.45,-.002,.13),.035)
bt_label.data.materials.clear();bt_label.data.materials.append(dark)

for c in [structure_col,pipe_col,scale_col]:scene.view_layers[0].layer_collection.children[c.name].exclude=True
scene['nguon_ban_ve']='BV phe duyet TH 12 13 14.pdf, 6 trang; thong so be/cap/thoat theo trang 1-2, 3-4, 5-6'
scene['tham_so_uoc_luong']='Than H1100 D450/D320; ton1.5; chau sau75; voi cao85; neo 4 tam230; bo tri ong ben trong'
scene['pham_vi']='Mo hinh 3D tham khao theo anh va be ky thuat PDF; khong phai ban ve che tao. Chua chon TH12/13/14 cho ong ngoai tru.'
scene['moc_cao_do']='Mat da z=+250mm, co z=0; cot duoi be va gach theo mat cat; than cao1100 tren mat da'
for name in ['Mo_hinh_README','Mo_hinh_Tham_so.json']:
    if name in bpy.data.texts:bpy.data.texts.remove(bpy.data.texts[name])
params={'estimated_mm':{'body_height':1100,'body_top_diameter':450,'body_bottom_diameter':320,'sheet':1.5,'basin_depth':75,'tap_height':85},'pdf_mm':{'rc_slab':[1000,1000,150],'granite_top':[1040,1080,20],'mortar_thickness':20,'sleeve_diameter':120,'anchor_thread':10,'rebar_diameter':10,'rebar_length':950,'supply_OD':27,'drain_OD':42},'notes':['No external main network modeled: TH12 DN100/4m, TH13 D63/4m, TH14 DN300/10m need site choice.','Tap and concealed routing are indicative; manufacturer and stainless grade unconfirmed.','Original Scene preserved intact.']}
bpy.data.texts.new('Mo_hinh_Tham_so.json').write(json.dumps(params,ensure_ascii=False,indent=2))
bpy.data.texts.new('Mo_hinh_README').write('TRỤ NƯỚC UỐNG TẠI VÒI SAWACO\n\nScene TRU_NUOC_SAWACO: mô hình ngoài.\nScene TRU_NUOC_KY_THUAT: minh hoạ bên trong, neo, thép và người tỷ lệ 1700mm.\nScene gốc được giữ nguyên.\n\nThông số bệ và đường kính ống theo PDF người dùng. Thân, chậu và vòi ước lượng theo ảnh; chưa có hồ sơ chế tạo.\nCó thể chỉnh từng đối tượng và vật liệu trong các collection. Mã dựng được lưu kèm build_fountain.py.\n')
source=bpy.data.texts.new('build_fountain.py');source.write((ASSETS/'build_fountain.py').read_text(encoding='utf-8'))
for img in bpy.data.images:
    if img.source=='FILE' and img.has_data:
        try:img.pack()
        except:pass
for f in bpy.data.fonts:
    if f.filepath:
        try:f.pack()
        except:pass
bpy.context.window.scene=scene
for o in bpy.context.selected_objects:o.select_set(False)
shell.select_set(True);bpy.context.view_layer.objects.active=shell
for screen in bpy.data.screens:
    for a in screen.areas:
        if a.type=='VIEW_3D':
            s=a.spaces.active;s.clip_start=.005;s.clip_end=1000;s.shading.type='MATERIAL'
            s.overlay.show_floor=False;s.overlay.show_extras=False
            s.region_3d.view_location=Vector((.04,0,.73));s.region_3d.view_distance=3.15;s.region_3d.view_rotation=cam.rotation_euler.to_quaternion();s.region_3d.view_perspective='PERSP'
scene.render.filepath=str(ASSETS/'Tru_nuoc_SAWACO.png')
blend_path=OUT/'Tru_nuoc_SAWACO.blend'
assert not blend_path.exists(), 'Output already exists; do not overwrite without inspection.'
bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
(OUT/'Thong_so_nguon.json').write_text(json.dumps(params,ensure_ascii=False,indent=2),encoding='utf-8')
result={'status':'created','blend_file':str(blend_path),'scene':scene.name,'objects_main':len(scene.objects),'objects_technical':len(tech.objects),'estimated_body_mm':[1100,450,320],'pdf_base_mm':[1000,1000,150],'main_scene_original_preserved':list(bpy.data.scenes['Scene'].objects.keys())}
