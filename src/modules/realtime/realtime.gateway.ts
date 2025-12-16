import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * RealtimeGateway - WebSocket gateway untuk realtime updates
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private _server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  /**
   * Handle koneksi client
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Handle diskoneksi client
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Client join ke room tertentu (pusat/cabang)
   */
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    void client.join(data.room);
    this.logger.log(`Client ${client.id} joined room: ${data.room}`);
    return { event: 'joined', room: data.room };
  }

  /**
   * Emit event ketika ada transaksi baru masuk ke pusat
   */
  emitTransaksiBaru(transaksi: {
    id: string;
    nomorTransaksi: string;
    lokasiCabang: string;
    totalHarga: unknown;
    tanggal: Date;
  }) {
    const data = {
      id: transaksi.id,
      nomorTransaksi: transaksi.nomorTransaksi,
      lokasiCabang: transaksi.lokasiCabang,
      totalHarga: transaksi.totalHarga,
      tanggal: transaksi.tanggal,
    };

    this._server.to('pusat').emit('transaksi_baru', data);
    this.logger.log(`Emitted transaksi_baru: ${transaksi.nomorTransaksi}`);
  }

  /**
   * Emit event ketika ada update produk (setelah sync)
   */
  emitProdukUpdate(data: { action: string; count: number }) {
    const payload = {
      action: data.action,
      count: data.count,
      timestamp: new Date().toISOString(),
    };

    this._server.to('cabang').emit('produk_update', payload);
    this.logger.log(`Emitted produk_update: ${data.action}`);
  }

  /**
   * Emit status sinkronisasi
   */
  emitSyncStatus(data: {
    pendingCount: number;
    syncedCount: number;
    failedCount: number;
  }) {
    const payload = {
      pendingCount: data.pendingCount,
      syncedCount: data.syncedCount,
      failedCount: data.failedCount,
      timestamp: new Date().toISOString(),
    };

    this._server.emit('sync_status', payload);
    this.logger.log(`Emitted sync_status`);
  }
}
