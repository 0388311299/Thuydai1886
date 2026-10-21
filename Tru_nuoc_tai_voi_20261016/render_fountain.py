import bpy, json
from pathlib import Path
out=Path('G:/My Drive/Sang kien Webgame/models/Tru_nuoc_tai_voi_20261016')
results=[]
for scene_name,filename in [('TRU_NUOC_SAWACO','Tru_nuoc_SAWACO.png'),('TRU_NUOC_KY_THUAT','Tru_nuoc_cau_tao.png')]:
    scene=bpy.data.scenes[scene_name]
    scene.cycles.samples=48 if scene_name=='TRU_NUOC_SAWACO' else 32
    scene.render.filepath=str(out/filename)
    scene.render.threads_mode='FIXED'
    scene.render.threads=6
    bpy.ops.render.render(write_still=True,scene=scene_name)
    results.append({'scene':scene_name,'image':str(out/filename),'bytes':(out/filename).stat().st_size})
(out/'render_complete.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
