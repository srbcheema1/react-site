import config from './config'

export function get_service_endpoint(service_name) {
    return config["SERVICE_ENDPOINTS"][service_name]
}
