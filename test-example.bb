# Example BitBake recipe file
DESCRIPTION="Example recipe"
HOMEPAGE="https://example.com"
LICENSE="MIT"
LIC_FILES_CHKSUM="file://LICENSE;md5=abcdef1234567890"

SRC_URI="https://example.com/package.tar.gz"
SRC_URI[md5sum]="abcdef1234567890"
SRC_URI[sha256sum]="abcdef1234567890"

DEPENDS="zlib openssl"
RDEPENDS_${PN}="bash"

S="${WORKDIR}/package"

inherit autotools pkgconfig

EXTRA_OECONF="--enable-shared --disable-static"

do_configure(){
    ./configure ${EXTRA_OECONF}
}

do_compile(){
    oe_runmake all
}

do_install(){
    oe_runmake install DESTDIR=${D}
}

FILES_${PN}="${bindir}/* ${libdir}/*"
FILES_${PN}-dev="${includedir}/* ${libdir}/*.a"

addtask custom_task after do_compile before do_install

python do_custom_python_task() {
    bb.note("Running custom Python task")
    d.setVar('CUSTOM_VAR', 'custom_value')
}

BBCLASSEXTEND="native nativesdk"