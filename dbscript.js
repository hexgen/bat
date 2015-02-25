//var Db = require('mongodb').Db,
//    MongoClient = require('mongodb').MongoClient,
//    Server = require('mongodb').Server,
//    ReplSetServers = require('mongodb').ReplSetServers,
//    ObjectID = require('mongodb').ObjectID,
//    Binary = require('mongodb').Binary,
//    GridStore = require('mongodb').GridStore,
//    Grid = require('mongodb').Grid,
//    Code = require('mongodb').Code,
//    BSON = require('mongodb').pure().BSON,
//    assert = require('assert');
//
//var db = new Db('bat2', new Server('192.168.10.170', 27017));
//// Establish connection to db
//db.open(function(err, db) {
//    assert.equal(null, err);
//
//    // Reference a different database sharing the same connections
//    // for the data transfer
//    var secondDb = db.db("integration_tests_2");
//
//    // Fetch the collections
//    var multipleColl1 = db.collection("multiple_db_instances");
//    var multipleColl2 = secondDb.collection("multiple_db_instances");
//
//    // Write a record into each and then count the records stored
//    multipleColl1.insert({a:1}, {w:1}, function(err, result) {
//        multipleColl2.insert({a:1}, {w:1}, function(err, result) {
//
//            // Count over the results ensuring only on record in each collection
//            multipleColl1.count(function(err, count) {
//                assert.equal(1, count);
//
//                multipleColl2.count(function(err, count) {
//                    assert.equal(1, count);
//
//                    db.close();
//                });
//            });
//        });
//    });
//});
//
//public function note( $modelName )
//{
//    $searchModels = [
//        'Patient',
//        'Lead'
//    ];
//
//    $lookupFields = [
//        'owner',
//        'changer',
//        'creator',
//        'lead',
//        'patient'
//    ];
//
//    $dbAdapter = $this->getServiceLocator()->get( 'wepo_company' );
//
//    $noteGW = new MongoGateway( $modelName, $dbAdapter );
//    $notes  = $noteGW->find( [ ] )->toArray();
//
////        prn( $modelName );
//
//    $count = 0;
//    foreach ($notes as $note) {
//    $resModelName = $modelName;
//    $flag         = true;
//    prn( ++$count, (string) $note[ '_id' ] );
//    if (!empty( $note[ 'target' ] )) {
//        foreach ($searchModels as $extModelName) {
//            $targetGW = new MongoGateway( $extModelName, $dbAdapter );
//            $extModel =
//                $targetGW->find( [ '_id_export' => $note[ 'target' ] ] )
//            ->current();
//            if (isset( $extModel )) {
//                $flag                                            =
//                    false;
//                $resModelName                                    =
//                    $resModelName . $extModelName;
//                $note                                            =
//                    array_merge( $this->getModelServiceVerify()
//                        ->get( $resModelName )->toArray(),
//                        $note );
//                $note                                            =
//                    new \ArrayObject( $note,
//                                \ArrayObject::ARRAY_AS_PROPS );
//                $note->{strtolower( $extModelName ) . '_export'} =
//                    $note->target;
//                break;
//            }
//        }
//    }
//    if ($flag) {
//        $resModelName = $resModelName . 'Lead';
//        $note         =
//            array_merge( $this->getModelServiceVerify()
//                ->get( $resModelName )->toArray(),
//                $note );
//        $note         =
//            new \ArrayObject( $note, \ArrayObject::ARRAY_AS_PROPS );
//    }
////            prn( $resModelName, $flag );
//
//    $settings = $this->getServiceLocator()
//    ->get( 'ModelFramework\ConfigService' )
//    ->getByObject( $resModelName,
//        new ModelConfig() )->fields;
//
//    foreach ($lookupFields as $field) {
//        if (isset( $note->{$field . '_export'} )) {
//        $setting      = $settings[ $field ];
//        $extModelName = $setting[ 'model' ];
//        $gw           =
//            new MongoGateway( $extModelName, $dbAdapter );
//        $model        =
//            $gw->find( [
//                '_id_export' => $note->{$field . '_export'}
//] )->current();
//    if (isset( $model )) {
//        $note->{$field . '_id'} = $model->_id;
//}
//}
//}
//$noteGW->update( $note, [ '_id' => $note->_id ] );
//$temp = $this->getModelServiceVerify()->get( $resModelName );
//$note = (array) $note;
//$temp->exchangeArray( $note );
//try {
//    $this->serviceLocator->get( 'ModelFramework\LogicService' )
//    ->get( 'zohoimport', $resModelName )
//    ->trigger( $temp );
//} catch ( \Exception $ex ) {
//    prn( 'Exception', $ex->getMessage() );
//}
//$temp->_id = null;
////            prn($resModelName,$temp);
////            exit;
//$this->getGatewayServiceVerify()->get( $resModelName )->save( $temp );
////            exit;
//}
//}