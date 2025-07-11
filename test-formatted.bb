# Unformatted BitBake file for testing
DESCRIPTION = "Example recipe with poor formatting"
HOMEPAGE = "https://example.com"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=abcdef1234567890"

SRC_URI = "https://example.com/package.tar.gz"

DEPENDS = "zlib openssl"
RDEPENDS_${PN}="bash"

# Configuration
EXTRA_OECONF = "--enable-shared --disable-static"

do_configure() {
        ./configure ${EXTRA_OECONF}
}

do_compile() {
    oe_runmake all
}

python do_custom_python_task() {
    bb.note("Running custom Python task")
    d.setVar('CUSTOM_VAR', 'custom_value')
}

addtask custom_task after do_compile before do_install

FILES_${PN}="${bindir}/* ${libdir}/*"