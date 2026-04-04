#!/usr/bin/env python3
"""Process and optimize pet photos for Grotto Sitters website."""

from PIL import Image, ImageOps
import os
import shutil

OUTPUT_DIR = "public/images"
MAX_SIZE = 1200
QUALITY = 80

# Complete photo mapping: source_filename -> output_name
# Grouped by pet for clarity
PHOTO_MAP = {
    # === PET PHOTOS ===

    # Chester (Jess & Sam) - red cocker spaniel
    "Chester.jpeg": "chester-1",

    # Alfie (Carissa D.) - tan cockapoo
    "Alfie.jpeg": "alfie-1",
    "Alfie .jpeg": "alfie-2",

    # Travis (Emma) - Hungarian Vizsla
    "178C2DD4-D243-47BA-A194-386A512FEDA8_4_5005_c.jpeg": "travis-1",  # walking on path
    "86B95B84-3105-414A-ABC0-01663A1CC500_1_105_c.jpeg": "travis-2",   # close-up portrait
    "3FD264FA-F1BA-4751-8D63-4E1938E412F9_4_5005_c.jpeg": "travis-3",  # sleeping in blankets
    "3FF7F86C-BB91-4F28-B8A4-C8DC2B2C0D75_4_5005_c.jpeg": "travis-4",  # cuddling with owner
    "7965EFE7-0639-4AB7-B225-9A60E1CC8A3B_1_105_c.jpeg": "travis-5",   # on Niamh's lap at desk
    "D7553869-FBD3-4B96-B6AC-1168D3AA91B5_1_105_c.jpeg": "travis-6",   # in kitchen with another dog

    # Solomon (Thomas James) - labradoodle
    "00FF5251-1A20-4CEC-8D36-56888977E600_4_5005_c.jpeg": "solomon-1",  # on grass urban
    "5B0C024E-4515-467B-824B-D3E2E7D140DE_4_5005_c.jpeg": "solomon-2",  # muddy walk
    "5CE2B690-B5C3-4C5A-A147-5B4B5F3633B2_4_5005_c.jpeg": "solomon-3",  # in elevator
    "C6D8CE08-C671-4A1C-89AB-2899A4BCBC00_4_5005_c.jpeg": "solomon-4",  # in snow
    "CCA29463-693C-4042-8A95-24DBF757A4B8_4_5005_c.jpeg": "solomon-5",  # close-up face

    # Orca (Benjamin T.) - B&W springer spaniel
    "9A9CD7E7-BCD5-424F-A3D9-E7D8435E6282_4_5005_c.jpeg": "orca-1",    # on couch
    "200A4F20-49AC-47D1-997A-0F64912CD3A1_4_5005_c.jpeg": "orca-2",    # in park with stick
    "0C3F3C74-D005-4523-B447-5A7BFD845BCB_4_5005_c.jpeg": "orca-3",    # in kitchen
    "4ED91426-C4F4-4E00-A59F-CF7C060E6E94_4_5005_c.jpeg": "orca-4",    # countryside path

    # YubYub (Javier P.) - scraggly cavapoo
    "92DB23B7-CD5E-48B3-AF34-3B68B0C14666_4_5005_c.jpeg": "yubyub-1",  # held by Niamh

    # Arlo (Stephanie P.) - very small white dog
    "E57C081E-DD09-43C5-9C1B-BE403B91812E_4_5005_c.jpeg": "arlo-1",    # Niamh holding
    "4536C275-8002-4E73-BE4B-A10601D48D29_4_5005_c.jpeg": "arlo-2",    # in car seat

    # Molly & Sparky (Emily) - white labradoodle + bearded dragon
    "Molly.JPG": "molly-1",
    "49C329B5-A73A-4303-81AF-70B11CA4147B_4_5005_c.jpeg": "molly-2",   # in living room
    "E307C76E-5ADE-4227-AEEB-6F86146136C3_4_5005_c.jpeg": "molly-3",   # in doorway
    "6AE4FA70-1816-4E2B-9C78-05E100E83E88_4_5005_c.jpeg": "molly-4",   # Niamh on sofa
    "783F95CE-5CC1-4F23-A95A-5B5966034310_4_5005_c.jpeg": "sparky-1",  # bearded dragon

    # Bailey (Libby) - golden cockapoo
    "6957E2FE-9984-4569-B6DB-733E176FE245_4_5005_c.jpeg": "bailey-1",  # on path sunset
    "95410626-4B8F-4839-A627-31FE7250018A_4_5005_c.jpeg": "bailey-2",  # countryside path
    "AA7E7E0A-B002-47AB-A5F2-8746B63371F4_4_5005_c.jpeg": "bailey-3",  # garden with ball
    "EEA3F7EF-8278-4202-AC78-70F05D24E000_4_5005_c.jpeg": "bailey-4",  # lying on kitchen floor

    # Zeus (Danielle) - Weimaraner
    "Zeus.JPG": "zeus-1",

    # Poppy (Janet) - black Labrador
    "Poppy.JPG": "poppy-1",

    # Scuff (Kimberley's 3 pets)
    "Scuff.JPG": "scuff-1",

    # Matilda (Erin) - golden cocker spaniel
    "Matilda.JPG": "matilda-1",

    # Finley (Kimberley) - large dark dog
    "Finley.JPG": "finley-1",

    # Luffy - chocolate spaniel puppy
    "Luffy.jpeg": "luffy-1",

    # Daisy & Rocky - Shih Tzu pair
    "Daisy and Rocky.JPG": "daisy-rocky-1",

    # Hero & Ted (Charlotte) - Doberman + small curly dog
    "Hero and Ted.JPG": "hero-ted-1",

    # Toby (Phillipa) - black cocker spaniel
    "8440D2E3-43E0-469E-9767-35F30CD2D2FF_4_5005_c.jpeg": "toby-1",    # at back door
    "980CF0C7-0F74-4C80-9070-11D135679255_4_5005_c.jpeg": "toby-2",    # Niamh at cafe
    "B6D65B76-E0F9-4A0E-87F3-ACD95EDC9800_4_5005_c.jpeg": "toby-3",    # belly up on sofa

    # Mali (Elizabeth) - Santa doodle
    "23782B02-157C-449A-BC5F-9ACCE1AE4054_4_5005_c.jpeg": "mali-1",    # in Santa costume
    "8A07182C-19EF-4DC0-9179-80614C890C48_4_5005_c.jpeg": "mali-2",    # Callum in kitchen

    # Lena (Onur C.) - black flat-coated spaniel
    "06C06B72-C51D-4767-ACDF-5A68DAA2978B_4_5005_c.jpeg": "lena-1",    # with green ball
    "D54E7F7D-2796-4D04-9E02-1A7D500B4680_4_5005_c.jpeg": "lena-2",    # Callum in park
    "8CC2A3DB-30FB-478E-9C8C-A11B81A97F67_4_5005_c.jpeg": "lena-3",    # Niamh selfie
    "C8463BC0-E82A-4FC8-AC0A-E75963F18E49_4_5005_c.jpeg": "lena-4",    # looking up in park
    "D4F4C33E-5A76-4D7D-90E3-EBFFCD99568C_4_5005_c.jpeg": "lena-5",    # Niamh at night
    "FF672705-00ED-4476-8717-01A9A77E4071_1_105_c.jpeg": "lena-6",     # being petted

    # Angela's pets (Poppy, Hunter, Bella, Tess, Fraser)
    "062958F5-D929-4014-B132-B93F30A83C5A_1_105_c.jpeg": "angela-pets-1",  # labs by fireplace
    "31F97A8C-6267-40F8-90B1-71694E506725_1_105_c.jpeg": "angela-pets-2",  # grey cat
    "AF23F719-A17B-48D7-9760-7074E0DB09A7_1_105_c.jpeg": "angela-pets-3",  # cat in bag
    "76B344C3-FA00-4FE2-BAE2-B0EFF1AE3857_1_105_c.jpeg": "angela-pets-4",  # dogs by French doors
    "B9B626EA-AD15-40FB-B020-99D584BABEEB_1_105_c.jpeg": "angela-pets-5",  # farm scene
    "DA960FAE-7C63-45ED-8C3B-63FB01FD3E40_1_105_c.jpeg": "angela-pets-6",  # grey cat on bed

    # Charlotte's tabby cat (cocker spaniel + tabby)
    "29598C14-5F9B-449B-913E-DCFA073ED17B_1_102_o.jpeg": "charlotte-cat-1",
    "8C9AC77A-566A-415A-95F5-E853334D5583_1_102_o.jpeg": "charlotte-cat-2",

    # Deb's two dogs
    "A97B9AE7-1FEA-45E9-862E-630A55C9092E_4_5005_c.jpeg": "deb-dogs-1",   # two on sofa
    "A5ECC5F6-BB56-4102-AC4C-139CE54D1D94_4_5005_c.jpeg": "deb-dogs-2",   # two looking up
    "0BBA3FC4-8290-48B5-800E-33ED0D34AD60_4_5005_c.jpeg": "deb-dogs-3",   # on sofa + floor

    # Extra group photos
    "D5C74672-6552-4623-A4E0-44A438F57691_4_5005_c.jpeg": "spaniels-tv-1",   # two spaniels watching TV
    "714BB796-40A1-4F58-A5AE-81F114731509_4_5005_c.jpeg": "orca-5",          # springer sleeping
    "14B62E6D-9741-4736-8892-6B7572A091C1_4_5005_c.jpeg": "dogs-in-car-1",   # two dogs in car
    "43E7D3FF-F79A-4C22-84B2-39F5701B74BB_4_5005_c.jpeg": "dogs-courtyard-1", # border collie + doodle
    "82ED2CD3-7F50-4967-B932-A50998A4CF67_4_5005_c.jpeg": "lena-7",          # in car
    "1A3EB4A5-F5A3-4B60-9AD3-1A20053B4F45_4_5005_c.jpeg": "lena-8",         # on hillside
    "4528792B-59A0-45C2-B7C3-64E8AB773026_1_201_a.jpeg": "black-dog-toy-1",  # black dog with toy
    "4F007E4F-00BB-4C19-A2E1-BA8D7F59CD7A_4_5005_c.jpeg": "callum-dinner-1", # Callum at dinner
    "D88598A0-4DDE-4823-9B01-3B9B1FE9179C_4_5005_c.jpeg": "arlo-3",         # two small dogs
    "C903C574-92BF-4248-B4EC-5D2882D12B05_4_5005_c.jpeg": "mali-3",         # woman with cockapoo
    "27118C52-B3A9-4473-AB38-4B72DF4E9352_1_105_c.jpeg": "alfie-3",         # cockapoo on sofa
    "8F3A93E8-79D5-447F-9688-F10F58DDAC61_4_5005_c.jpeg": "callum-dog-1",   # Callum with small dog
    "8F3A93E8-79D5-447F-9688-F10F58DDAC61_4_5005_c.jpeg": "mali-4",         # Callum with dog outdoors

    # === COUPLE PHOTOS (for hero/about) ===
    "FullSizeRender.jpeg": "couple-bw-1",
    "IMG_1706.JPG": "couple-field-1",
    "IMG_4223.jpeg": "couple-dinner-1",
    "IMG_5158.jpg": "couple-boat-1",
    "IMG_6795.jpeg": "couple-night-1",
    "IMG_8858.jpeg": "couple-villa-1",
    "93df828f-b493-4473-8b59-838e10ad442c.JPG": "couple-airport-1",
}


def optimize_image(src_path, dst_path):
    """Resize, auto-orient, and compress an image."""
    try:
        img = Image.open(src_path)

        # Auto-orient based on EXIF data
        img = ImageOps.exif_transpose(img)

        # Convert to RGB if necessary (e.g., RGBA PNGs)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Resize if larger than MAX_SIZE on longest side
        w, h = img.size
        if max(w, h) > MAX_SIZE:
            if w > h:
                new_w = MAX_SIZE
                new_h = int(h * MAX_SIZE / w)
            else:
                new_h = MAX_SIZE
                new_w = int(w * MAX_SIZE / h)
            img = img.resize((new_w, new_h), Image.LANCZOS)

        # Save as JPEG
        img.save(dst_path, "JPEG", quality=QUALITY, optimize=True)
        size_kb = os.path.getsize(dst_path) / 1024
        print(f"  OK: {os.path.basename(dst_path)} ({img.size[0]}x{img.size[1]}, {size_kb:.0f}KB)")
        return True
    except Exception as e:
        print(f"  ERROR: {src_path} -> {e}")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    success = 0
    fail = 0
    skip = 0

    for src_name, dst_name in PHOTO_MAP.items():
        src_path = os.path.join(".", src_name)
        dst_path = os.path.join(OUTPUT_DIR, f"{dst_name}.jpg")

        if not os.path.exists(src_path):
            print(f"  SKIP (not found): {src_name}")
            skip += 1
            continue

        # Don't overwrite existing optimized images unless source is newer
        if os.path.exists(dst_path):
            print(f"  EXISTS: {dst_name}.jpg (overwriting)")

        if optimize_image(src_path, dst_path):
            success += 1
        else:
            fail += 1

    print(f"\nDone: {success} optimized, {fail} failed, {skip} skipped")


if __name__ == "__main__":
    main()
