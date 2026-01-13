import os
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from models import db, Lead, Curso, CursoLead, Nota
from dotenv import load_dotenv
from datetime import datetime
from flasgger import Swagger

load_dotenv()

app = Flask(__name__)
CORS(app)
Swagger(app, template={
    "info": {
        "title": "Ondasformación CRM API",
        "description": "API para la gestión de leads y cursos de Ondasformación",
        "version": "1.0.0"
    }
})

# Database configuration
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "ondas_crm")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create tables (Optional: Only if they don't exist)
# with app.app_context():
#     db.create_all()

@app.route('/api/leads', methods=['GET', 'POST'])
def manage_leads():
    if request.method == 'GET':
        leads = Lead.query.all()
        return jsonify([lead.to_dict() for lead in leads])
    
    data = request.json
    new_lead = Lead(
        nombre=data['nombre'],
        telefono=data.get('telefono'),
        mail=data.get('mail'),
        trabajador=data.get('trabajador', False)
    )
    db.session.add(new_lead)
    db.session.commit()
    return jsonify(new_lead.to_dict()), 201

@app.route('/api/leads/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def lead_detail(id):
    lead = Lead.query.get_or_404(id)
    if request.method == 'GET':
        return jsonify(lead.to_dict())
    
    if request.method == 'PUT':
        data = request.json
        lead.nombre = data.get('nombre', lead.nombre)
        lead.telefono = data.get('telefono', lead.telefono)
        lead.mail = data.get('mail', lead.mail)
        lead.trabajador = data.get('trabajador', lead.trabajador)
        db.session.commit()
        return jsonify(lead.to_dict())
    
    if request.method == 'DELETE':
        CursoLead.query.filter_by(id_lead=id).delete()
        Nota.query.filter_by(id_lead=id).delete()
        db.session.delete(lead)
        db.session.commit()
        return '', 204

@app.route('/api/leads/<int:id_lead>/dni/<side>', methods=['GET', 'POST'])
def manage_lead_dni(id_lead, side):
    lead = Lead.query.get_or_404(id_lead)
    
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        file_data = file.read()
        if side == 'anverso':
            lead.dni_anverso = file_data
        elif side == 'reverso':
            lead.dni_reverso = file_data
        else:
            return jsonify({"error": "Invalid side"}), 400
            
        db.session.commit()
        return jsonify({"message": f"DNI {side} uploaded"}), 200
        
    if request.method == 'GET':
        if side == 'anverso':
            data = lead.dni_anverso
        elif side == 'reverso':
            data = lead.dni_reverso
        else:
            return jsonify({"error": "Invalid side"}), 400
            
        if not data:
            return jsonify({"error": "Image not found"}), 404
            
        return send_file(
            io.BytesIO(data),
            mimetype='image/jpeg',
            as_attachment=False,
            download_name=f'dni_{side}_{id_lead}.jpg'
        )

@app.route('/api/leads/<int:id_lead>/notas', methods=['GET', 'POST'])
def manage_lead_notas(id_lead):
    if request.method == 'GET':
        notas = Nota.query.filter_by(id_lead=id_lead).all()
        return jsonify([nota.to_dict() for nota in notas])
    
    data = request.json
    new_nota = Nota(
        id_lead=id_lead,
        id_curso=data['id_curso'],
        contenido=data['contenido'],
        titulo=data.get('titulo'),
        fecha=datetime.utcnow()
    )
    db.session.add(new_nota)
    db.session.commit()
    return jsonify(new_nota.to_dict()), 201

@app.route('/api/cursos', methods=['GET', 'POST'])
def manage_cursos():
    if request.method == 'GET':
        cursos = Curso.query.all()
        return jsonify([curso.to_dict() for curso in cursos])
    
    data = request.json
    new_curso = Curso(
        nombre=data['nombre'],
        max_alumnos=data.get('max_alumnos'),
        codigo=data.get('codigo'),
        fecha_inicio=datetime.fromisoformat(data['fecha_inicio']).date() if data.get('fecha_inicio') else None,
        fecha_fin=datetime.fromisoformat(data['fecha_fin']).date() if data.get('fecha_fin') else None
    )
    db.session.add(new_curso)
    db.session.commit()
    return jsonify(new_curso.to_dict()), 201

@app.route('/api/cursos/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def curso_detail(id):
    curso = Curso.query.get_or_404(id)
    if request.method == 'GET':
        return jsonify(curso.to_dict())
    
    if request.method == 'PUT':
        data = request.json
        curso.nombre = data.get('nombre', curso.nombre)
        curso.max_alumnos = data.get('max_alumnos', curso.max_alumnos)
        curso.lleno = data.get('lleno', curso.lleno)
        curso.codigo = data.get('codigo', curso.codigo)
        if 'fecha_inicio' in data:
            curso.fecha_inicio = datetime.fromisoformat(data['fecha_inicio']).date() if data['fecha_inicio'] else None
        if 'fecha_fin' in data:
            curso.fecha_fin = datetime.fromisoformat(data['fecha_fin']).date() if data['fecha_fin'] else None
        db.session.commit()
        return jsonify(curso.to_dict())
    
    if request.method == 'DELETE':
        CursoLead.query.filter_by(id_curso=id).delete()
        Nota.query.filter_by(id_curso=id).delete()
        db.session.delete(curso)
        db.session.commit()
        return '', 204

@app.route('/api/cursos/<int:id_curso>/leads', methods=['GET', 'POST'])
def manage_curso_leads(id_curso):
    if request.method == 'GET':
        relations = CursoLead.query.filter_by(id_curso=id_curso).all()
        return jsonify([rel.to_dict() for rel in relations])
    
    data = request.json
    new_rel = CursoLead(
        id_curso=id_curso,
        id_lead=data['id_lead'],
        estado=data.get('estado', 'Nuevo'),
        fecha_formulario=datetime.utcnow()
    )
    db.session.add(new_rel)
    db.session.commit()
    return jsonify(new_rel.to_dict()), 201

@app.route('/api/cursos/<int:id_curso>/leads/<int:id_lead>', methods=['PUT', 'DELETE'])
def curso_lead_detail(id_curso, id_lead):
    rel = CursoLead.query.filter_by(id_curso=id_curso, id_lead=id_lead).first_or_404()
    
    if request.method == 'PUT':
        data = request.json
        if 'estado' in data:
            rel.estado = data['estado']
        db.session.commit()
        return jsonify(rel.to_dict())
    
    if request.method == 'DELETE':
        db.session.delete(rel)
        db.session.commit()
        return '', 204

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    try:
        # 1. Fetch all data in 4 fast queries
        cursos = Curso.query.all()
        leads = Lead.query.all()
        rels = CursoLead.query.all()
        notes = Nota.query.all()
        
        # 2. Build indexed maps for O(1) lookups
        leads_map = {l.id_lead: l.to_dict() for l in leads}
        
        # Group notes by (lead, course)
        notes_by_lead_course = {}
        # Also group all notes by lead for general view
        notes_by_lead = {}
        
        for n in notes:
            n_dict = n.to_dict()
            # Group by lead/course
            key = (n.id_lead, n.id_curso)
            if key not in notes_by_lead_course: notes_by_lead_course[key] = []
            notes_by_lead_course[key].append(n_dict)
            
            # Group by lead
            if n.id_lead not in notes_by_lead: notes_by_lead[n.id_lead] = []
            notes_by_lead[n.id_lead].append(n_dict)
            
        # Group relationships by course
        rels_by_course = {}
        rels_by_lead = {}
        for r in rels:
            if r.id_curso not in rels_by_course: rels_by_course[r.id_curso] = []
            rels_by_course[r.id_curso].append(r)
            
            if r.id_lead not in rels_by_lead: rels_by_lead[r.id_lead] = []
            rels_by_lead[r.id_lead].append(r)

        # 3. Build Courses Result
        cursos_result = []
        for c in cursos:
            c_dict = c.to_dict()
            c_dict['leads'] = []
            
            c_rels = rels_by_course.get(c.id_curso, [])
            for r in c_rels:
                if r.id_lead in leads_map:
                    l_entry = leads_map[r.id_lead].copy()
                    l_entry['estado'] = r.estado
                    l_entry['notes'] = notes_by_lead_course.get((r.id_lead, c.id_curso), [])
                    c_dict['leads'].append(l_entry)
            cursos_result.append(c_dict)
            
        # 4. Build General Leads Result
        all_leads_result = []
        for lid, l_data in leads_map.items():
            l_copy = l_data.copy()
            l_copy['notes'] = notes_by_lead.get(lid, [])
            l_rels = rels_by_lead.get(lid, [])
            l_copy['estado'] = l_rels[0].estado if l_rels else "Nuevo"
            all_leads_result.append(l_copy)
            
        return jsonify({
            "courses": cursos_result,
            "all_leads": all_leads_result
        })
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"ERROR in get_dashboard: {error_msg}")
        return jsonify({"error": str(e), "trace": error_msg}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
