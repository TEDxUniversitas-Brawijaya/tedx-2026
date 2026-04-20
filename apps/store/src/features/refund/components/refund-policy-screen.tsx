import { Button } from "@tedx-2026/ui/components/button";
import bg from "@/assets/imgs/texture-black.png";

export function RefundPolicyScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <section
      className="relative mx-auto grid min-h-screen w-full place-content-center bg-center bg-cover px-4 pt-28 pb-14"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative max-w-5xl px-4 text-white">
        <div className="relative">
          <h1 className="text-center font-serif-2 text-2xl uppercase tracking-wide md:text-4xl">
            Kebijakan Pengembalian Dana (Refund Policy)
          </h1>

          <div className="mt-8">
            <ul className="list-outside list-disc font-sans-2 text-base text-gray-100 md:text-2xl">
              <li>
                Dapat diajukan refund apabila terjadi:
                <div className="pl-4">
                  <p>a. pembayaran ganda/lebih; atau</p>
                  <p>b. pembatalan acara; atau</p>
                  <p>c. pergantian tanggal acara</p>
                </div>
              </li>
              <li>
                Tiket tidak dapat diajukan refund apabila pembeli tidak hadir
                tanpa alasan yang termasuk dalam kebijakan.
              </li>
              <li>
                Pengajuan refund harus dilakukan melalui formulir khusus yang
                ada pada website resmi TEDx Universitas Brawijaya.
              </li>
              <li>
                Proses refund berlangsung sekitar 7-14 hari kerja sejak
                pengajuan diterima.
              </li>
              <li>
                Dalam kondisi pembayaran ganda/lebih, biaya layanan refund akan
                ditanggung oleh pembeli. Namun, jika acara dibatalkan oleh pihak
                TEDxUniversitasBrawijaya, biaya layanan akan ditanggung oleh
                pihak penyelenggara.
              </li>
              <li>
                Jika tanggal acara dijadwalkan ulang, maka tiket tetap berlaku
                untuk tanggal baru yang dijadwalkan. Refund hanya disetujui
                apabila pembeli tidak dapat menghadiri tanggal terbaru.
              </li>
              <li>
                Penyelenggara tidak bertanggung jawab atas penjualan kembali
                tiket di luar platform resmi.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={onContinue} size="lg" variant="store-primary">
              Ajukan Pengembalian Dana
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
