from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
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
    activo = db.Column(db.Boolean, default=True)
    fecha_inicio = db.Column(db.Date)
    fecha_fin = db.Column(db.Date)
    codigo = db.Column(db.String(20), unique=True)
    horario = db.Column(db.String(15), nullable=True)
    horas_totales = db.Column(db.Integer, nullable=True)
    para_trabajadores = db.Column(db.Boolean, default=False)
    activo = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id_curso": self.id_curso,
            "nombre": self.nombre,
            "max_alumnos": self.max_alumnos,
            "lleno": self.lleno,
            "activo": self.activo,
            "fecha_inicio": self.fecha_inicio.isoformat() if self.fecha_inicio else None,
            "fecha_fin": self.fecha_fin.isoformat() if self.fecha_fin else None,
            "codigo": self.codigo,
            "horario": self.horario,
            "horas_totales": self.horas_totales,
            "para_trabajadores": self.para_trabajadores,
            "activo": self.activo
        }

class CursoLead(db.Model):
    __tablename__ = 'cursos_leads'
    id_curso = db.Column(db.Integer, db.ForeignKey('cursos.id_curso', ondelete='CASCADE'), primary_key=True)
    id_lead = db.Column(db.Integer, db.ForeignKey('leads.id_lead', ondelete='CASCADE'), primary_key=True)
    estado = db.Column(db.String(50), default='Nuevo')
    fecha_formulario = db.Column(db.DateTime, default=datetime.utcnow)
    ultimo_contacto = db.Column(db.DateTime, default=datetime.utcnow)
    mail_enviado = db.Column(db.Boolean, default=False)
    whatsapp_enviado = db.Column(db.Boolean, default=False)
    mail_ia = db.Column(db.Boolean, default=False)
    origen = db.Column(db.String(50), default='META')

    def to_dict(self):
        return {
            "id_curso": self.id_curso,
            "id_lead": self.id_lead,
            "estado": self.estado,
            "fecha_formulario": self.fecha_formulario.isoformat() if self.fecha_formulario else None,
            "ultimo_contacto": self.ultimo_contacto.isoformat() if self.ultimo_contacto else None,
            "mail_enviado": self.mail_enviado,
            "whatsapp_enviado": self.whatsapp_enviado,
            "mail_ia": self.mail_ia,
            "origen": self.origen
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


class Usuario(db.model):
    __tablename__ = 'usuarios'

    id_usuario    = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(50), unique=True, nullable=False)
    email         = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    nombre        = db.Column(db.String(100), nullable=False)
    rol           = db.Column(db.Enum('admin', 'operador', name='rol_usuario'),
                              default='operador', nullable=False)
    activo        = db.Column(db.Boolean, default=True, nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'username':   self.username,
            'email':      self.email,
            'nombre':     self.nombre,
            'rol':        self.rol,
            'activo':     self.activo,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }