<?php
/**
 * Created by PhpStorm.
 * User: vlad
 * Date: 24.02.15
 * Time: 19:10
 */
$count = 0;
foreach ($rules as $rule) {
    if ((count($rule) > 3)
        && (in_array($rule['_models']['to'], $supportedModels))
    ) {
        if ( !isset($rule['_models'])
            || !isset($rule['_models']['from'])
            || !isset($rule['_models']['to'])
        ) {
            throw new \Exception('_models property does not set correctly');
        }

        $gwSrc = new MongoGateway($rule['_models']['from'],
            $dbAdapterCSV);
        $gwTar = $this->getGatewayServiceVerify()
            ->get($rule['_models']['to']);

        $result = $gwSrc->fetchAll();

        foreach ($result as $srcModel) {
            prn(++$count, (string)$srcModel->_id);
            $trgModel = new \ArrayObject($gwTar->model()->toArray(),
                \ArrayObject::ARRAY_AS_PROPS);
            foreach ($rule as $k => $f) {
                if ($k[0] == '_') {
                    continue;
                }
                if ( !is_array($f)) {
                    $trgModel[$f] = '' . $srcModel[$k];

                } else {
                    if ($f['to'] == '_id') {
                        $trgModel['_id_export'] = '' . $srcModel[$k];
                    } else {
                        $trgModel[$f['to'] . '_export']
                            = '' . $srcModel[$k];
                    }
                }
            }

            $trgModel['status_id'] = new \MongoId(Status::NEW_);
//                    $trgModel->status_id = Status::NEW_;
            if (empty($trgModel['_id_export'])) {
                $trgModel['_id_export'] = $srcModel['_id'];
            }
            //if you want long but clear copying of db
            $gwTar->insert($trgModel);
        }
    }
}

