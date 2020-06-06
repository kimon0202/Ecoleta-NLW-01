/* eslint-disable no-return-await */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  async create(req: Request, res: Response) {
    // console.log(req.body);
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();

    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx('points').insert(point);

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id: insertedIds[0],
        };
      });

    await trx('point_items').insert(pointItems);
    await trx.commit();

    return res.json({ id: insertedIds[0], ...point });
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const paredItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', paredItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('*');

    const serializedPoints = points.map(point => ({
      ...point,
      image_url: `http://192.168.0.12:3333/uploads/${point.image}`,
    }));

    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({ message: 'Point was not found. ' });
    }

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.12:3333/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return res.json({ point: serializedPoint, items });
  }
}

export default new PointsController();
