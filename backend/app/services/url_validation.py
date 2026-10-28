
import ipaddress
import socket
from urllib.parse import urlsplit


def validate_public_http_url(url: str) -> str:
    """Reject malformed URLs and hosts resolving to non-public IPs."""
    try:
        parsed = urlsplit(url)

        if parsed.scheme.lower() not in {"http", "https"}:
            raise ValueError("Only HTTP and HTTPS URLs are supported.")

        if not parsed.hostname:
            raise ValueError("A valid hostname is required.")

        if parsed.username is not None or parsed.password is not None:
            raise ValueError("URLs containing credentials are not supported.")

        hostname = parsed.hostname.rstrip(".").lower()
        port = parsed.port

        if not hostname:
            raise ValueError("A valid hostname is required.")

        if hostname == "localhost" or hostname.endswith(".localhost"):
            raise ValueError("Local network destinations are not supported.")

        if hostname.endswith((".local", ".internal")):
            raise ValueError("Local network destinations are not supported.")

        try:
            address = ipaddress.ip_address(hostname)
            addresses = [address]
        except ValueError:
            try:
                results = socket.getaddrinfo(
                    hostname,
                    port or (443 if parsed.scheme.lower() == "https" else 80),
                    type=socket.SOCK_STREAM,
                )
            except socket.gaierror as error:
                raise ValueError(
                    "The media hostname could not be resolved."
                ) from error

            addresses = [
                ipaddress.ip_address(result[4][0].split("%")[0])
                for result in results
            ]

        if not addresses or any(not address.is_global for address in addresses):
            raise ValueError("Non-public network destinations are not supported.")

        return url

    except ValueError:
        raise
    except (OSError, TypeError) as error:
        raise ValueError("The media URL could not be validated.") from error
