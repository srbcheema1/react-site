import config from "./config";

export function get_service_endpoint(service_name) {
    // if ("SERVICE_ENDPOINTS" in local_overrides) {
    //     let eps = local_overrides["SERVICE_ENDPOINTS"];
    //     if (service_name in eps) {
    //         return eps[service_name];
    //     }
    // }
    return config["SERVICE_ENDPOINTS"][service_name];
}
