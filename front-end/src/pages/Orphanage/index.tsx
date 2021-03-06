import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiClock, FiInfo } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import {
  FooterMap,
  Main,
  MapContainer,
  OpenDetails,
  OrphanageDetails,
  OrphanageDetailsContent,
  OrphanageImages,
  PageOrphanage,
} from './styles';
import Sidebar from '../../components/Sidebar';
import mapIcon from '../../utils/mapIcon';
import api from '../../services/api';

interface IOrphanage {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: {
    path: string;
    id: number;
  }[];
}

function Orphanage() {
  const [orphanage, setOphanage] = useState<IOrphanage>();
  const [activeIndexImage, setActiveIndexImage] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    api.get(`/orphanages/${id}`).then(res => {
      const ophanageRes = res.data;
      setOphanage(ophanageRes);

      console.log(ophanageRes);
    });
  }, [id]);

  if (!orphanage) {
    return <p>loading...</p>;
  }

  return (
    <PageOrphanage>
      <Sidebar />
      <Main>
        <OrphanageDetails>
          <img
            src={orphanage.images[activeIndexImage].path}
            alt={orphanage.name}
          />
          <OrphanageImages>
            {orphanage.images.map((image, index) => (
              <button
                key={image.id}
                className={activeIndexImage === index ? 'activeOrpha' : ''}
                type="button"
                onClick={() => {
                  setActiveIndexImage(index);
                }}
              >
                <img src={image.path} alt={orphanage.name} />
              </button>
            ))}
          </OrphanageImages>
          <OrphanageDetailsContent>
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>
            <MapContainer>
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]}
                />
              </Map>

              <FooterMap>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                >
                  Ver rotas no Google Maps
                </a>
              </FooterMap>
            </MapContainer>

            <hr />
            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <OpenDetails>
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF6690" />
                  Não atendemos <br />
                  fim de semana
                </div>
              )}
            </OpenDetails>
            {/* <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </OrphanageDetailsContent>
        </OrphanageDetails>
      </Main>
    </PageOrphanage>
  );
}

export default Orphanage;
