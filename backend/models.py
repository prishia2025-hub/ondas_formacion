from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Lead(db.Model):
    __tablename__ = 'leads'
    id_lead = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), unique=True)
    mail = db.Column(db.String(150))
    trabajador = db.Column(db.Boolean, default=False)
    dni_anverso = db.Column(db.LargeBinary)
    dni_reverso = db.Column(db.LargeBinary)

    def to_dict(self):
        return {
            "id_lead": self.id_lead,
            "nombre": self.nombre,
            "telefono": self.telefono,
            "mail": self.mail,
            "trabajador": self.trabajador,
            "has_dni_anverso": bool(self.dni_anverso),
            "has_dni_reverso": bool(self.dni_reverso)
        }

class Curso(db.Model):
    __tablename__ = 'cursos'
    id_curso = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    max_alumnos = db.Column(db.Integer)
    lleno = db.Column(db.Boolean, default=False)
    fecha_inicio = db.Column(db.Date)
    fecha_fin = db.Column(db.Date)
    codigo = db.Column(db.String(20), unique=True)

    def to_dict(self):
        return {
            "id_curso": self.id_curso,
            "nombre": self.nombre,
            "max_alumnos": self.max_alumnos,
            "lleno": self.lleno,
            "fecha_inicio": self.fecha_inicio.isoformat() if self.fecha_inicio else None,
            "fecha_fin": self.fecha_fin.isoformat() if self.fecha_fin else None,
            "codigo": self.codigo
        }

class CursoLead(db.Model):
    __tablename__ = 'cursos_leads'
    id_curso = db.Column(db.Integer, db.ForeignKey('cursos.id_curso', ondelete='CASCADE'), primary_key=True)
    id_lead = db.Column(db.Integer, db.ForeignKey('leads.id_lead', ondelete='CASCADE'), primary_key=True)
    estado = db.Column(db.String(50), default='Nuevo')
    fecha_formulario = db.Column(db.DateTime, default=datetime.utcnow)
    mail_enviado = db.Column(db.Boolean, default=False)
    whatsapp_enviado = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id_curso": self.id_curso,
            "id_lead": self.id_lead,
            "estado": self.estado,
            "fecha_formulario": self.fecha_formulario.isoformat() if self.fecha_formulario else None,
            "mail_enviado": self.mail_enviado,
            "whatsapp_enviado": self.whatsapp_enviado
        }

class Nota(db.Model):
    __tablename__ = 'notas'
    id_nota = db.Column(db.Integer, primary_key=True)
    id_lead = db.Column(db.Integer, db.ForeignKey('leads.id_lead', ondelete='CASCADE'), nullable=False)
    id_curso = db.Column(db.Integer, db.ForeignKey('cursos.id_curso', ondelete='CASCADE'), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    titulo = db.Column(db.String(30))

    def to_dict(self):
        return {
            "id_nota": self.id_nota,
            "id_lead": self.id_lead,
            "id_curso": self.id_curso,
            "contenido": self.contenido,
            "fecha": self.fecha.isoformat() if self.fecha else None,
            "titulo": self.titulo
        }

class Documento(db.Model):
    __tablename__ = 'documentos'
    id_documento = db.Column(db.Integer, primary_key=True)
    id_lead = db.Column(db.Integer, db.ForeignKey('leads.id_lead', ondelete='CASCADE'), nullable=False)
    id_curso = db.Column(db.Integer, db.ForeignKey('cursos.id_curso', ondelete='CASCADE'), nullable=False)
    documento = db.Column(db.LargeBinary)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_documento": self.id_documento,
            "id_lead": self.id_lead,
            "id_curso": self.id_curso,
            "fecha_creacion": self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
