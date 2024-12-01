from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.models.base import Base


class GeoObjectType(Base):
    __tablename__ = "geo_object_types"
    name: Mapped[str]
    geo_objects: Mapped[list["GeoObject"]] = relationship(
        back_populates="type", lazy="selectin"
    )



class GeometryType(Base):
    __tablename__ = "geometry_types"

    name: Mapped[str]
    geometry_id: Mapped[int] = mapped_column(ForeignKey("geo_object_geometries.id"))
    geometry: Mapped[list["GeoObjectGeometry"]] = relationship(
        back_populates="type", uselist=True, lazy="selectin"
    )


class PropertyType(Base):
    __tablename__ = "property_types"
    name: Mapped[str]
    properties: Mapped[list["GeoObjectProperty"]] = relationship(
        back_populates="property_type", lazy="selectin"
    )


class Coordinate(Base):
    __tablename__ = "coordinates"
    x: Mapped[float]
    y: Mapped[float]
    geometry_id: Mapped[int] = mapped_column(ForeignKey("geo_object_geometries.id"))
    geometry: Mapped["GeoObjectGeometry"] = relationship(
        back_populates="coordinates", uselist=False, lazy="selectin"
    )


class GeoObjectStatus(Base):
    __tablename__ = "geo_object_statuses"
    name: Mapped[str]
    properties: Mapped[list["GeoObjectProperty"]] = relationship(
        back_populates="status", uselist=True, lazy="selectin"
    )



class GeoObjectProperty(Base):
    __tablename__ = "geo_object_properties"
    
    name: Mapped[str]
    depth: Mapped[float]
    description: Mapped[str] = mapped_column(nullable=True)
    geo_object_id: Mapped[int] = mapped_column(ForeignKey("geo_objects.id"))
    status_id: Mapped[int] = mapped_column(ForeignKey("geo_object_statuses.id"))
    property_type_id: Mapped[int] = mapped_column(ForeignKey("property_types.id"))
    status: Mapped["GeoObjectStatus"] = relationship(
        back_populates="properties", lazy="selectin"
    )
    property_type: Mapped["PropertyType"] = relationship(
        back_populates="properties", lazy="selectin"
    )
    geo_object: Mapped["GeoObject"] = relationship(
        back_populates="properties", lazy="selectin"
    )


class GeoObjectGeometry(Base):
    __tablename__ = "geo_object_geometries"
    
    type: Mapped["GeometryType"] = relationship(back_populates="geometry", lazy="selectin")
    geo_object_id: Mapped[int] = mapped_column(ForeignKey("geo_objects.id"))
    coordinates: Mapped[list["Coordinate"]] = relationship(
        back_populates="geometry", uselist=True, lazy="selectin"
    )
    geo_object: Mapped["GeoObject"] = relationship(
        back_populates="geometry", uselist=False, lazy="selectin"
    )


class GlobalLayer(Base):
    __tablename__ = "global_layers"
    
    name: Mapped[str]
    geo_objects: Mapped[list["GeoObject"]] = relationship(
        back_populates="global_layers", 
        uselist=True, 
        lazy="selectin", 
        secondary='global_layers_geo_objects'
    )

    
class GeoObject(Base):
    __tablename__ = "geo_objects"

    id: Mapped[int] = mapped_column(primary_key=True)
    type_id: Mapped[int] = mapped_column(ForeignKey("geo_object_types.id"))
    type: Mapped["GeoObjectType"] = relationship(
        back_populates="geo_objects", lazy="selectin"
    )
    properties: Mapped["GeoObjectProperty"] = relationship(
        back_populates="geo_object", 
        uselist=False, 
        lazy="selectin"
    )
    geometry: Mapped["GeoObjectGeometry"] = relationship(
        back_populates="geo_object", 
        uselist=False, 
        lazy="selectin"
    )
    global_layers: Mapped[list["GlobalLayer"]] = relationship(
        back_populates="geo_objects", 
        lazy="selectin", 
        uselist=True,
        secondary='global_layers_geo_objects'
    )


class GlobalLayerGeoObject(Base):
    __tablename__ = "global_layers_geo_objects"

    global_layer_id: Mapped[int] = mapped_column(ForeignKey("global_layers.id"))
    geo_object_id: Mapped[int] = mapped_column(ForeignKey("geo_objects.id"))