import requests
import json
import brotli
import zlib

# Define the target URL
URL = "https://leetcode.com/api/submissions/?offset=0&limit=20&lastkey="

# Define the headers
HEADERS = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "cookie": (
        "gr_user_id=2be38db5-eea5-435e-8031-3a813c747f4d;"
        "__stripe_mid=51dca288-ed7e-467b-a653-f344d40235c6f807cc;"
        "87b5a3c3f1a55520_gr_last_sent_cs1=yangsteven;"
        "cf_clearance=3HLrHVj5_J.0NLyTgSmUAW0cZh2q2xWT6EweC.2irdQ-1731339661-1.2.1.1-NtAAMF..ywIHyhCYrbmkgro51qWupM9FzLIQJbxLpQA_.p_o0wTmUaQf5tbx65tJIPMtwn5zjp9AxpQ9LPaQzr8VudyaNkzY48Gh2IYfM5uS8EBac2UrD.q9K9z1ZaEik.a0FskgQ92NNKF4b4NWyuOJAI3U9Kp1HcoYyJo6fYfqdazgqFT1ScDWDmAzjeGNKdZumhGt1CMMZq0KPuEbyxS4aFZm8BlGm99QgooTsN0WIwAg5xWWN2WBsovVV5IKYiyd00iK_BMFfgtV8R4J8VxkuGe7ulZmnWHHi4PX_qqd5GbljhocpCiNIwy57kxxtaxWczeVCyqL_Y311pHQLNhZJK5bsns60b209_sRqMyffgTeaVVIWhVbamLN0cMih8R6BkRiASeJZXu4lG9GrZ4ONcO1MgczAIm91AcChJJrpvhoteHRbG6kw1aZgFt0;"
        "csrftoken=qkK2umymgBw6Qh38sL84NpfLOPq54Zq5ia9C9gOdq55PIukhF8sY6EXOhrHLHagM;"
        "87b5a3c3f1a55520_gr_cs1=yangsteven;"
        "_ga=GA1.1.766076669.1719115090;"
        "_ga_CDRWKZTDEX=GS1.1.1732634941.172.1.1732636134.59.0.0;"
        "INGRESSCOOKIE=6627697b7c459f78a36d8c57ae61cdf7|8e0876c7c1464cc0ac96bc2edceabd27;"
        "ip_check=(false, '72.138.138.18');"
        "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiNzAwNjQ1MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijk1YzhiYjA1MmJlMTQ1ZTg4ODZkMWVjNTdjOTc0ZjBlMDRmMmE5NjA3YjcwNTdkMGUyMTczZWUyZWIwZGQxYzEiLCJpZCI6NzAwNjQ1MywiZW1haWwiOiJzdGV2ZW50YW55YW5nQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoieWFuZ3N0ZXZlbiIsInVzZXJfc2x1ZyI6InlhbmdzdGV2ZW4iLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvZGVmYXVsdF9hdmF0YXIuanBnIiwicmVmcmVzaGVkX2F0IjoxNzMzMDA2OTM3LCJpcCI6IjcyLjEzOC4xMzguMTgiLCJpZGVudGl0eSI6ImE0NTVlYmM2N2QwYjUwMDdlMmEwNTU0MTRkZDE0ZDc4IiwiZGV2aWNlX3dpdGhfaXAiOlsiYjlmM2RkNjFkZmVlYzE1YTdlNGIxOWYzMTcxYTU4NmMiLCI3Mi4xMzguMTM4LjE4Il0sInNlc3Npb25faWQiOjk4NTYxLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.UNgCgLDuk4vTA_WA_G_5edSlWF_q1xE3i71IkZPYBJU;"
        "__stripe_sid=b6e5edcb-0b32-45e7-ad13-9eba486fd05e40a25e;"
        "__cf_bm=WA6iviuMSPhBtmTAQw8LMU80oRmxlsyUQrgYqBtnU6I-1733009344-1.0.1.1-hsCdW2cC3OIPgFf.39cCuiRM.JIJfK8PLoaVV7habFEzcykHtlYQ02GMiHjjCTtJQJBiQEZW6tbbGJIi0NlenA;"
        "_dd_s=rum=0&expire=1733010848490;"
    ),  # Replace with a valid cookie
    "priority": "u=1, i",
    "referer": "https://leetcode.com/submissions/",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-arch": '""',
    "sec-ch-ua-bitness": '"64"',
    "sec-ch-ua-full-version": '"131.0.6778.86"',
    "sec-ch-ua-full-version-list": '"Google Chrome";v="131.0.6778.86", "Chromium";v="131.0.6778.86", "Not_A Brand";v="24.0.0.0"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-model": '"Nexus 5"',
    "sec-ch-ua-platform": '"Android"',
    "sec-ch-ua-platform-version": '"6.0"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
}

# Output file
OUTPUT_FILE = "leetcode_submissions.json"



def decompress_response(response):
    """Decompress Brotli-encoded response with fallback."""
    encoding = response.headers.get("Content-Encoding", "")
    print(f"Content-Encoding: {encoding}")

    if "br" in encoding:
        try:
            print("Decompressing Brotli-encoded response...")
            return brotli.decompress(response.content).decode("utf-8")
        except Exception as e:
            print(f"Brotli decompression failed: {e}")
            print("Retrying without Accept-Encoding...")
            HEADERS.pop("accept-encoding", None)  # Remove encoding header and retry
            retry_response = requests.get(URL, headers=HEADERS)
            return retry_response.text  # Return uncompressed text
    else:
        print("No Brotli compression detected, using plain response...")
        return response.text

def fetch_and_save_data():
    try:
        response = requests.get(URL, headers=HEADERS)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")

        # Handle decompression
        content = decompress_response(response)

        # Parse JSON
        data = json.loads(content)
        print("JSON parsed successfully.")

        # Save JSON to file
        with open("leetcode_submissions.json", "w") as file:
            json.dump(data, file, indent=4)
        print("Data successfully saved to leetcode_submissions.json.")

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    fetch_and_save_data()